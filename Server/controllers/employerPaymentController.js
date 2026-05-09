// controllers/employerPaymentController.js — FULL UPDATED FILE
// এই পুরো file টা তোমার existing employerPaymentController.js replace করো

const Stripe = require('stripe');
const db     = require('../config/db');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Helper: promise query ────────────────────────────────────────────────────
const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([r]) => r);
    }
    return new Promise((resolve, reject) =>
        db.query(sql, params, (err, r) => err ? reject(err) : resolve(r))
    );
};

// ─── Helper: create notification ─────────────────────────────────────────────
const notify = async (employer_id, title, message) => {
    try {
        await query(
            'INSERT INTO notifications (employer_id, type, title, message, is_urgent) VALUES (?, ?, ?, ?, ?)',
            [employer_id, 'verify', title, message, 0]
        );
    } catch (e) { console.error('notify error:', e.message); }
};

// ─── 1. Create Stripe Checkout Session ───────────────────────────────────────
// POST /api/employer-payment/create-session
exports.createCheckoutSession = async (req, res) => {
    try {
        const { employer_id, amount, reference, request_id } = req.body;

        if (!employer_id || !amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'employer_id and amount are required' });
        }

        const amountCents = Math.round(parseFloat(amount) * 100);

        const emps = await query('SELECT company_name, email FROM employers WHERE id = ?', [parseInt(employer_id)]);
        if (!emps.length) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: emps[0].email,
            line_items: [{
                price_data: {
                    currency:     'usd',
                    unit_amount:  amountCents,
                    product_data: {
                        name:        'SNJ GlobalRoutes — Worker Placement Service Fee',
                        description: reference || 'Employer Payment',
                    },
                },
                quantity: 1,
            }],
            metadata: {
                employer_id: String(employer_id),
                request_id:  String(request_id || ''),
                reference:   reference || 'SNJ-GENERAL',
                amount:      String(amount),
            },
            success_url: `${frontendUrl}/employer-dashboard?tab=payment&payment_success=1&amount=${amount}&reference=${encodeURIComponent(reference || 'SNJ-GENERAL')}&request_id=${request_id || ''}&employer_id=${employer_id}`,
            cancel_url:  `${frontendUrl}/employer-dashboard?tab=payment&payment_cancelled=1`,
        });

        return res.json({ success: true, url: session.url, session_id: session.id });

    } catch (err) {
        console.error('createCheckoutSession error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 2. Record Payment — reduce due_payment after Stripe success ──────────────
// POST /api/employer-payment/record
exports.recordPayment = async (req, res) => {
    try {
        const { employer_id, amount_paid, reference, request_id } = req.body;

        if (!employer_id || !amount_paid) {
            return res.status(400).json({ success: false, message: 'employer_id and amount_paid are required' });
        }

        const paid = parseFloat(amount_paid);
        if (isNaN(paid) || paid <= 0) {
            return res.status(400).json({ success: false, message: 'amount_paid must be positive' });
        }

        // ── Specific request ─────────────────────────────────────────────────
        if (request_id && parseInt(request_id) > 0) {
            const rows = await query(
                'SELECT * FROM worker_requests WHERE id = ? AND employer_id = ?',
                [parseInt(request_id), parseInt(employer_id)]
            );
            if (!rows.length) {
                return res.status(404).json({ success: false, message: 'Request not found' });
            }

            const row      = rows[0];
            const prev_due = parseFloat(row.due_payment || 0);
            const new_due  = parseFloat(Math.max(0, prev_due - paid).toFixed(2));
            const new_paid = parseFloat((parseFloat(row.total_paid || 0) + paid).toFixed(2));

            await query(
                'UPDATE worker_requests SET due_payment = ?, total_paid = ? WHERE id = ?',
                [new_due, new_paid, parseInt(request_id)]
            );

            // Log to employer_payments
            await query(
                `INSERT INTO employer_payments (employer_id, request_id, amount, reference, status)
                 VALUES (?, ?, ?, ?, 'succeeded')`,
                [parseInt(employer_id), parseInt(request_id), paid, reference || 'SNJ-GENERAL']
            );

            await notify(
                parseInt(employer_id),
                'Payment Recorded ✓',
                `$${paid.toFixed(2)} recorded for REQ-${request_id}. Remaining due: $${new_due.toFixed(2)}. Ref: ${reference || 'N/A'}.`
            );

            return res.json({
                success: true,
                message: 'Payment recorded and due updated',
                data: { request_id: parseInt(request_id), amount_paid: paid, prev_due, new_due, new_total_paid: new_paid }
            });
        }

        // ── Auto-distribute across all pending dues (oldest first) ───────────
        const pending = await query(
            `SELECT * FROM worker_requests WHERE employer_id = ? AND due_payment > 0 ORDER BY created_at ASC`,
            [parseInt(employer_id)]
        );

        if (!pending.length) {
            const latest = await query(
                'SELECT * FROM worker_requests WHERE employer_id = ? ORDER BY created_at DESC LIMIT 1',
                [parseInt(employer_id)]
            );
            if (latest.length) {
                const new_paid = parseFloat((parseFloat(latest[0].total_paid || 0) + paid).toFixed(2));
                await query('UPDATE worker_requests SET total_paid = ? WHERE id = ?', [new_paid, latest[0].id]);
                await query(
                    `INSERT INTO employer_payments (employer_id, request_id, amount, reference, status)
                     VALUES (?, ?, ?, ?, 'succeeded')`,
                    [parseInt(employer_id), latest[0].id, paid, reference || 'SNJ-GENERAL']
                );
            }
            await notify(parseInt(employer_id), 'Payment Received ✓',
                `$${paid.toFixed(2)} received. No pending dues. Ref: ${reference || 'N/A'}.`);

            return res.json({ success: true, message: 'Payment recorded. No dues to reduce.', data: { amount_paid: paid } });
        }

        let remaining = paid;
        const updates = [];

        for (const row of pending) {
            if (remaining <= 0) break;
            const curr_due = parseFloat(row.due_payment);
            const deduct   = parseFloat(Math.min(remaining, curr_due).toFixed(2));
            const new_due  = parseFloat((curr_due - deduct).toFixed(2));
            const new_paid = parseFloat((parseFloat(row.total_paid || 0) + deduct).toFixed(2));

            await query(
                'UPDATE worker_requests SET due_payment = ?, total_paid = ? WHERE id = ?',
                [new_due, new_paid, row.id]
            );
            // Log each distribution
            await query(
                `INSERT INTO employer_payments (employer_id, request_id, amount, reference, status)
                 VALUES (?, ?, ?, ?, 'succeeded')`,
                [parseInt(employer_id), row.id, deduct, reference || 'SNJ-GENERAL']
            );
            updates.push({ request_id: row.id, deducted: deduct, new_due });
            remaining = parseFloat((remaining - deduct).toFixed(2));
        }

        const newTotalDue = updates.reduce((s, u) => s + u.new_due, 0);
        await notify(parseInt(employer_id), 'Payment Distributed ✓',
            `$${paid.toFixed(2)} distributed across ${updates.length} request(s). Remaining due: $${newTotalDue.toFixed(2)}. Ref: ${reference || 'N/A'}.`);

        return res.json({
            success: true,
            message: 'Payment distributed successfully',
            data: { total_paid: paid, distributions: updates, unallocated: remaining }
        });

    } catch (err) {
        console.error('recordPayment error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 3. Get Payment History ───────────────────────────────────────────────────
// GET /api/employer-payment/history?employer_id=X
exports.getPaymentHistory = async (req, res) => {
    try {
        const { employer_id, limit = 20 } = req.query;
        if (!employer_id) {
            return res.status(400).json({ success: false, message: 'employer_id is required' });
        }

        const rows = await query(
            `SELECT ep.*, wr.job_title, wr.destination_country, wr.company_name AS request_company
             FROM employer_payments ep
             LEFT JOIN worker_requests wr ON wr.id = ep.request_id
             WHERE ep.employer_id = ?
             ORDER BY ep.paid_at DESC
             LIMIT ?`,
            [parseInt(employer_id), parseInt(limit)]
        );

        return res.json({ success: true, data: rows });
    } catch (err) {
        console.error('getPaymentHistory error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 4. Stripe Webhook (production) ──────────────────────────────────────────
exports.handleWebhook = async (req, res) => {
    const sig    = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session    = event.data.object;
        const { employer_id, request_id, reference, amount } = session.metadata || {};

        if (employer_id && amount) {
            const fakeReq = { body: { employer_id, amount_paid: amount, reference, request_id } };
            const fakeRes = { status: () => ({ json: () => {} }), json: () => {} };
            await exports.recordPayment(fakeReq, fakeRes);
        }
    }

    res.json({ received: true });
};