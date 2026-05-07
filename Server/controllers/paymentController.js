const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const db = require('../config/db');

// ─── DB Helper ────────────────────────────────────────────────────────────────
const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([r]) => r);
    }
    return new Promise((resolve, reject) =>
        db.query(sql, params, (err, r) => err ? reject(err) : resolve(r))
    );
};

// ─── Email Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'njmit2538@gmail.com',
        pass: 'ayev qwgh cygc hefh'
    }
});

// ─── Notification Helper (Employer) ──────────────────────────────────────────
const notifyEmployer = async (employer_id, title, message) => {
    try {
        await query(
            'INSERT INTO notifications (employer_id, type, title, message, is_urgent) VALUES (?, ?, ?, ?, ?)',
            [employer_id, 'verify', title, message, 0]
        );
    } catch (e) { console.error('notifyEmployer error:', e.message); }
};

// ─── 1. Create Payment Intent ─────────────────────────────────────────────────
// POST /api/payment/create-intent
// Supports: Visa, Mastercard, Amex + all other cards
const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, customerName } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseFloat(amount) * 100), // Convert to cents
            currency: currency || 'usd',
            description: `Payment for ${customerName || 'SNJ Global Routes Service'}`,
            // ── Explicitly enable Visa, Mastercard, Amex and more ────────────
            payment_method_types: ['card'],
            payment_method_options: {
                card: {
                    // Allow all major card networks including Visa, Mastercard, Amex
                    // Stripe automatically supports these when payment_method_types: ['card']
                    request_three_d_secure: 'automatic',
                },
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: error.message
        });
    }
};

// ─── 2. Confirm Payment & Notify + DB Update ──────────────────────────────────
// POST /api/payment/confirm-notification
// Called after Stripe confirms payment on frontend
const confirmPaymentAndNotify = async (req, res) => {
    try {
        const {
            amount,
            reference,
            customerEmail,
            status,
            employer_id,   // optional: Employer payment
            request_id,    // optional: Specific worker request
            partner_id,    // optional: B2B partner payment
            task_id,       // optional: Specific assigned task
            payment_intent_id, // optional: Stripe PI id for dedup
        } = req.body;

        if (status !== 'succeeded') {
            return res.status(400).json({ success: false, message: 'Payment not successful' });
        }

        const paid = parseFloat(amount);
        if (isNaN(paid) || paid <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        // ── A. Update Employer Payment Records ────────────────────────────────
        if (employer_id && parseInt(employer_id) > 0) {
            const empId = parseInt(employer_id);
            const reqId = request_id ? parseInt(request_id) : null;

            if (reqId && reqId > 0) {
                // Specific request — reduce due_payment
                const rows = await query(
                    'SELECT * FROM worker_requests WHERE id = ? AND employer_id = ?',
                    [reqId, empId]
                );
                if (rows.length) {
                    const row = rows[0];
                    const new_due  = Math.max(0, parseFloat(row.due_payment || 0) - paid).toFixed(2);
                    const new_paid = (parseFloat(row.total_paid || 0) + paid).toFixed(2);
                    await query(
                        'UPDATE worker_requests SET due_payment = ?, total_paid = ? WHERE id = ?',
                        [new_due, new_paid, reqId]
                    );
                    await notifyEmployer(empId, 'Payment Recorded ✓',
                        `$${paid.toFixed(2)} payment recorded for REQ-${reqId}. Remaining due: $${new_due}. Ref: ${reference || 'N/A'}.`
                    );
                }
            } else {
                // Auto-distribute across all pending dues (oldest first)
                const pending = await query(
                    `SELECT * FROM worker_requests WHERE employer_id = ? AND due_payment > 0 ORDER BY created_at ASC`,
                    [empId]
                );
                let remaining = paid;
                const updates = [];
                for (const row of pending) {
                    if (remaining <= 0) break;
                    const curr_due = parseFloat(row.due_payment);
                    const deduct   = Math.min(remaining, curr_due);
                    const new_due  = (curr_due - deduct).toFixed(2);
                    const new_paid = (parseFloat(row.total_paid || 0) + deduct).toFixed(2);
                    await query(
                        'UPDATE worker_requests SET due_payment = ?, total_paid = ? WHERE id = ?',
                        [new_due, new_paid, row.id]
                    );
                    updates.push({ request_id: row.id, deducted: deduct, new_due });
                    remaining = parseFloat((remaining - deduct).toFixed(2));
                }
                if (updates.length === 0) {
                    // No dues — credit to most recent
                    const latest = await query(
                        'SELECT * FROM worker_requests WHERE employer_id = ? ORDER BY created_at DESC LIMIT 1',
                        [empId]
                    );
                    if (latest.length) {
                        const new_paid = (parseFloat(latest[0].total_paid || 0) + paid).toFixed(2);
                        await query('UPDATE worker_requests SET total_paid = ? WHERE id = ?', [new_paid, latest[0].id]);
                    }
                }
                await notifyEmployer(empId, 'Payment Distributed ✓',
                    `$${paid.toFixed(2)} distributed across ${updates.length || 'latest'} request(s). Ref: ${reference || 'N/A'}.`
                );
            }
        }

        // ── B. Update B2B Partner Payment Records ─────────────────────────────
        if (partner_id && parseInt(partner_id) > 0) {
            const pId = parseInt(partner_id);
            const tId = task_id ? parseInt(task_id) : null;

            // Insert into b2b_payments log
            await query(
                `INSERT INTO b2b_payments (partner_id, task_id, amount, reference, stripe_intent, status)
                 VALUES (?, ?, ?, ?, ?, 'succeeded')`,
                [pId, tId || null, paid, reference || 'SNJ-GENERAL', payment_intent_id || null]
            );

            // Update b2b_partners credit_balance
            await query(
                `UPDATE b2b_partners SET credit_balance = credit_balance + ? WHERE id = ?`,
                [paid, pId]
            );

            // If specific task — reduce pending_payment
            if (tId) {
                const tasks = await query(
                    'SELECT * FROM assigned_tasks WHERE id = ? AND partner_id = ?',
                    [tId, pId]
                );
                if (tasks.length) {
                    const t = tasks[0];
                    const new_pending = Math.max(0, parseFloat(t.pending_payment || 0) - paid).toFixed(2);
                    const new_paid    = (parseFloat(t.total_paid || 0) + paid).toFixed(2);
                    await query(
                        'UPDATE assigned_tasks SET pending_payment = ?, total_paid = ? WHERE id = ?',
                        [new_pending, new_paid, tId]
                    );
                }
            }
        }

        // ── C. Send Email Notification to Admin ───────────────────────────────
        const mailOptions = {
            from: '"SNJ Global Routes" <njmit2538@gmail.com>',
            to: 'directorsnj932@gmail.com',
            subject: `💳 Payment Received: $${parseFloat(amount).toFixed(2)} — ${reference || 'SNJ-GENERAL'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #0B1F3A; padding: 24px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: #EAB308; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">
                            ✅ Payment Received
                        </h2>
                        <p style="color: #94a3b8; margin: 6px 0 0; font-size: 12px;">SNJ GlobalRoutes — Secure Payment System</p>
                    </div>
                    <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
                                <td style="padding: 10px; font-size: 18px; font-weight: 900; color: #15803d;">$${parseFloat(amount).toFixed(2)} USD</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Reference</td>
                                <td style="padding: 10px; font-size: 14px; font-weight: bold; color: #0B1F3A;">${reference || 'SNJ-GENERAL'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Customer Email</td>
                                <td style="padding: 10px; font-size: 14px; color: #0B1F3A;">${customerEmail || 'Not Provided'}</td>
                            </tr>
                            ${employer_id ? `<tr style="background: #f8fafc;"><td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Employer ID</td><td style="padding: 10px; font-size: 14px; font-weight: bold; color: #0B1F3A;">EMP-${String(employer_id).padStart(7,'0')}</td></tr>` : ''}
                            ${request_id ? `<tr><td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Request ID</td><td style="padding: 10px; font-size: 14px; font-weight: bold; color: #EAB308;">REQ-${request_id}</td></tr>` : ''}
                            ${partner_id ? `<tr style="background: #f8fafc;"><td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">B2B Partner ID</td><td style="padding: 10px; font-size: 14px; font-weight: bold; color: #0B1F3A;">${partner_id}</td></tr>` : ''}
                            <tr style="background: #f0fdf4;">
                                <td style="padding: 10px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Status</td>
                                <td style="padding: 10px; font-size: 14px; font-weight: bold; color: #15803d;">✅ SUCCESS</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 11px; color: #b45309;">
                            Database records have been automatically updated. Please log into the admin panel to verify.
                        </div>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error('Email send error (non-fatal):', mailErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Payment confirmed, database updated, admin notified'
        });

    } catch (error) {
        console.error('confirmPaymentAndNotify Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to process confirmation', error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPaymentAndNotify
};