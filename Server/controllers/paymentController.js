// controllers/paymentController.js
const nodemailer = require('nodemailer');
const db         = require('../config/db');

// ─── Stripe lazy init — dotenv load হওয়ার পর init হবে ──────────────────────
let _stripe = null;
const getStripe = () => {
    if (!_stripe) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key || !key.startsWith('sk_')) {
            throw new Error(`STRIPE_SECRET_KEY missing or invalid in .env (got: ${key ? key.slice(0,10) + '...' : 'undefined'})`);
        }
        _stripe = require('stripe')(key);
    }
    return _stripe;
};

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
const getTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM  || process.env.MAIL_USER || 'njmit2538@gmail.com',
        pass: process.env.EMAIL_PASS  || process.env.MAIL_PASS || 'ayev qwgh cygc hefh',
    },
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

// ─── Format currency ──────────────────────────────────────────────────────────
const fmt = (v) => `$${parseFloat(v || 0).toFixed(2)}`;

// ─── Professional Email HTML Builder ─────────────────────────────────────────
const buildEmailHtml = ({ title, subtitle, rows, note, footer }) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F0F3F8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(11,31,58,.12);">
        <tr>
          <td style="background:#0B1F3A;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="display:inline-block;background:#EAB308;border-radius:10px;width:42px;height:42px;line-height:42px;text-align:center;font-weight:900;color:#0B1F3A;font-size:15px;vertical-align:middle;">SJ</span>
                  <span style="color:#fff;font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;vertical-align:middle;margin-left:12px;">SNJ GlobalRoutes</span>
                </td>
                <td align="right">
                  <span style="color:#EAB308;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Official Payment System</span>
                </td>
              </tr>
            </table>
            <div style="margin-top:18px;">
              <div style="color:#EAB308;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">${subtitle || 'Payment Notification'}</div>
              <div style="color:#fff;font-size:22px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${title}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
              ${rows.map((r, i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#F8FAFC'};">
                <td style="padding:13px 16px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;width:38%;">${r.label}</td>
                <td style="padding:13px 16px;font-size:${r.large ? '20px' : '14px'};font-weight:${r.large ? '900' : 'bold'};color:${r.color || '#0B1F3A'};">${r.value}</td>
              </tr>`).join('')}
            </table>
            ${note ? `<div style="margin-top:20px;padding:14px 18px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;font-size:12px;color:#B45309;line-height:1.6;">${note}</div>` : ''}
          </td>
        </tr>
        <tr>
          <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:18px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:10px;color:#94A3B8;">${footer || 'SNJ GlobalRoutes · Secure Payment System · 2026'}</td>
                <td align="right"><span style="font-size:9px;font-weight:bold;color:#64748B;text-transform:uppercase;letter-spacing:1px;">Stripe Secured · PCI DSS</span></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ─── 1. Create Payment Intent ─────────────────────────────────────────────────
// POST /api/payment/create-intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, customerName } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const stripe = getStripe();

        const paymentIntent = await stripe.paymentIntents.create({
            amount:   Math.round(parseFloat(amount) * 100),
            currency: currency || 'usd',
            description: `Payment for ${customerName || 'SNJ Global Routes Service'}`,
            payment_method_types: ['card'],
        });

        // ── এটা সবচেয়ে গুরুত্বপূর্ণ — client_secret return করছি ──────────────
        console.log('[Stripe] PaymentIntent created:', paymentIntent.id);
        console.log('[Stripe] client_secret present:', !!paymentIntent.client_secret);

        return res.status(200).json({
            success:         true,
            clientSecret:    paymentIntent.client_secret,   // ← এটাই card form এ দরকার
            paymentIntentId: paymentIntent.id,
        });

    } catch (error) {
        console.error('[Stripe] createPaymentIntent Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error:   error.message,
        });
    }
};

// ─── 2. Confirm Payment & Notify + DB Update ──────────────────────────────────
// POST /api/payment/confirm-notification
exports.confirmPaymentAndNotify = async (req, res) => {
    try {
        const {
            amount, reference, customerEmail, status,
            employer_id, request_id,
            partner_id,  task_id,
            payment_intent_id,
        } = req.body;

        if (status !== 'succeeded') {
            return res.status(400).json({ success: false, message: 'Payment not successful' });
        }

        const paid = parseFloat(amount);
        if (isNaN(paid) || paid <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        let employerResult = null;
        let b2bResult      = null;

        // ── A. Employer Payment ───────────────────────────────────────────────
        if (employer_id && parseInt(employer_id) > 0) {
            employerResult = await _processEmployerPayment({
                employer_id: parseInt(employer_id),
                request_id:  request_id ? parseInt(request_id) : null,
                paid, reference, payment_intent_id,
            });
        }

        // ── B. B2B Partner Payment ────────────────────────────────────────────
        if (partner_id && parseInt(partner_id) > 0) {
            b2bResult = await _processB2BPayment({
                partner_id: parseInt(partner_id),
                task_id:    task_id ? parseInt(task_id) : null,
                paid, reference, payment_intent_id,
            });
        }

        // ── C. Admin Email ────────────────────────────────────────────────────
        await _sendAdminEmail({ paid, reference, customerEmail, employer_id, request_id, partner_id, task_id, employerResult, b2bResult });

        // ── D. User/Customer Email ────────────────────────────────────────────
        if (customerEmail && customerEmail !== 'Not Provided') {
            await _sendUserEmail({ paid, reference, customerEmail, employer_id, request_id, partner_id, employerResult, b2bResult });
        }

        return res.status(200).json({
            success: true,
            message: 'Payment confirmed, database updated, notifications sent',
        });

    } catch (error) {
        console.error('[Payment] confirmPaymentAndNotify Error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to process confirmation', error: error.message });
    }
};

// ─── Internal: Process Employer Payment ──────────────────────────────────────
async function _processEmployerPayment({ employer_id, request_id, paid, reference, payment_intent_id }) {
    const result = {
        type: 'employer', employer_id, request_id,
        updates: [], prev_total_due: 0, new_total_due: 0, total_paid_now: paid,
    };

    // Log to employer_payments table
    try {
        await query(
            `INSERT INTO employer_payments (employer_id, request_id, amount, reference, stripe_intent, status)
             VALUES (?, ?, ?, ?, ?, 'succeeded')`,
            [employer_id, request_id || null, paid, reference || 'SNJ-GENERAL', payment_intent_id || null]
        );
    } catch (e) { console.error('employer_payments insert error:', e.message); }

    if (request_id && request_id > 0) {
        const rows = await query(
            'SELECT * FROM worker_requests WHERE id = ? AND employer_id = ?',
            [request_id, employer_id]
        );
        if (rows.length) {
            const row      = rows[0];
            const prev_due = parseFloat(row.due_payment || 0);
            const new_due  = parseFloat(Math.max(0, prev_due - paid).toFixed(2));
            const new_paid = parseFloat((parseFloat(row.total_paid || 0) + paid).toFixed(2));

            result.prev_total_due = prev_due;
            result.new_total_due  = new_due;
            result.updates.push({ request_id, prev_due, new_due, deducted: Math.min(paid, prev_due) });

            await query(
                'UPDATE worker_requests SET due_payment = ?, total_paid = ? WHERE id = ?',
                [new_due, new_paid, request_id]
            );
            await notifyEmployer(employer_id, 'Payment Recorded ✓',
                `${fmt(paid)} recorded for REQ-${request_id}. Remaining due: ${fmt(new_due)}. Ref: ${reference || 'N/A'}.`
            );
        }
    } else {
        const pending = await query(
            'SELECT * FROM worker_requests WHERE employer_id = ? AND due_payment > 0 ORDER BY created_at ASC',
            [employer_id]
        );
        result.prev_total_due = pending.reduce((s, r) => s + parseFloat(r.due_payment || 0), 0);
        let remaining = paid;

        for (const row of pending) {
            if (remaining <= 0) break;
            const curr_due = parseFloat(row.due_payment);
            const deduct   = parseFloat(Math.min(remaining, curr_due).toFixed(2));
            const new_due  = parseFloat((curr_due - deduct).toFixed(2));
            const new_paid = parseFloat((parseFloat(row.total_paid || 0) + deduct).toFixed(2));
            await query('UPDATE worker_requests SET due_payment = ?, total_paid = ? WHERE id = ?', [new_due, new_paid, row.id]);
            result.updates.push({ request_id: row.id, prev_due: curr_due, new_due, deducted: deduct });
            remaining = parseFloat((remaining - deduct).toFixed(2));
        }

        if (result.updates.length === 0) {
            const latest = await query(
                'SELECT * FROM worker_requests WHERE employer_id = ? ORDER BY created_at DESC LIMIT 1',
                [employer_id]
            );
            if (latest.length) {
                const new_paid = parseFloat((parseFloat(latest[0].total_paid || 0) + paid).toFixed(2));
                await query('UPDATE worker_requests SET total_paid = ? WHERE id = ?', [new_paid, latest[0].id]);
            }
        }

        result.new_total_due = result.updates.reduce((s, u) => s + u.new_due, 0);
        await notifyEmployer(employer_id, 'Payment Distributed ✓',
            `${fmt(paid)} distributed across ${result.updates.length || 'latest'} request(s). Remaining: ${fmt(result.new_total_due)}. Ref: ${reference || 'N/A'}.`
        );
    }

    return result;
}

// ─── Internal: Process B2B Payment ───────────────────────────────────────────
async function _processB2BPayment({ partner_id, task_id, paid, reference, payment_intent_id }) {
    const result = { type: 'b2b', partner_id, task_id, prev_pending: 0, new_pending: 0, new_credit: 0 };

    await query(
        `INSERT INTO b2b_payments (partner_id, task_id, amount, reference, stripe_intent, status)
         VALUES (?, ?, ?, ?, ?, 'succeeded')`,
        [partner_id, task_id || null, paid, reference || 'SNJ-GENERAL', payment_intent_id || null]
    );

    await query('UPDATE b2b_partners SET credit_balance = credit_balance + ? WHERE id = ?', [paid, partner_id]);

    if (task_id && task_id > 0) {
        const tasks = await query('SELECT * FROM assigned_tasks WHERE id = ? AND partner_id = ?', [task_id, partner_id]);
        if (tasks.length) {
            const t = tasks[0];
            result.prev_pending = parseFloat(t.pending_payment || 0);
            const new_pending   = parseFloat(Math.max(0, result.prev_pending - paid).toFixed(2));
            const new_paid      = parseFloat((parseFloat(t.total_paid || 0) + paid).toFixed(2));
            result.new_pending  = new_pending;
            await query('UPDATE assigned_tasks SET pending_payment = ?, total_paid = ? WHERE id = ?', [new_pending, new_paid, task_id]);
        }
    }

    const partnerRows = await query('SELECT credit_balance FROM b2b_partners WHERE id = ?', [partner_id]);
    result.new_credit = partnerRows.length ? parseFloat(partnerRows[0].credit_balance || 0) : 0;

    return result;
}

// ─── Internal: Admin Email ────────────────────────────────────────────────────
async function _sendAdminEmail({ paid, reference, customerEmail, employer_id, request_id, partner_id, task_id, employerResult, b2bResult }) {
    try {
        const rows = [
            { label: 'Amount Paid',    value: fmt(paid),              large: true, color: '#15803D' },
            { label: 'Reference',      value: reference || 'SNJ-GENERAL' },
            { label: 'Customer Email', value: customerEmail || 'Not Provided' },
            { label: 'Status',         value: 'SUCCEEDED',            color: '#15803D' },
        ];
        if (employer_id) {
            rows.push({ label: 'Employer ID', value: `EMP-${String(employer_id).padStart(7, '0')}` });
            if (request_id) rows.push({ label: 'Request ID', value: `REQ-${request_id}`, color: '#B45309' });
            if (employerResult) {
                rows.push({ label: 'Previous Total Due', value: fmt(employerResult.prev_total_due) });
                rows.push({ label: 'New Total Due', value: fmt(employerResult.new_total_due), color: employerResult.new_total_due > 0 ? '#DC2626' : '#15803D' });
            }
        }
        if (partner_id) {
            rows.push({ label: 'B2B Partner ID', value: `PTR-${partner_id}` });
            if (task_id) rows.push({ label: 'Task ID', value: `TASK-${task_id}` });
            if (b2bResult) rows.push({ label: 'Credit Balance (after)', value: fmt(b2bResult.new_credit), color: '#15803D' });
        }

        await getTransporter().sendMail({
            from:    `"SNJ GlobalRoutes" <${process.env.EMAIL_FROM || 'njmit2538@gmail.com'}>`,
            to:      process.env.ADMIN_EMAIL || 'directorsnj932@gmail.com',
            subject: `Payment Received: ${fmt(paid)} - ${reference || 'SNJ-GENERAL'}`,
            html:    buildEmailHtml({
                title:    'Payment Received',
                subtitle: employer_id ? 'Employer Portal Payment' : partner_id ? 'B2B Partner Payment' : 'General Payment',
                rows,
                note:    'Database records have been automatically updated.',
                footer:  `SNJ GlobalRoutes Admin · ${new Date().toLocaleString('en-GB')}`,
            }),
        });
    } catch (e) { console.error('Admin email error (non-fatal):', e.message); }
}

// ─── Internal: User Email ─────────────────────────────────────────────────────
async function _sendUserEmail({ paid, reference, customerEmail, employer_id, request_id, partner_id, employerResult, b2bResult }) {
    try {
        const rows = [
            { label: 'Amount Paid',    value: fmt(paid),             large: true, color: '#15803D' },
            { label: 'Reference',      value: reference || 'SNJ-GENERAL' },
            { label: 'Status',         value: 'Payment Successful',  color: '#15803D' },
            { label: 'Date & Time',    value: new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }) },
        ];
        if (employer_id && request_id) rows.push({ label: 'Request', value: `REQ-${request_id}` });
        if (employerResult && employerResult.updates.length > 0) {
            rows.push({ label: 'Previous Due', value: fmt(employerResult.prev_total_due) });
            rows.push({ label: 'Remaining Due', value: fmt(employerResult.new_total_due), color: employerResult.new_total_due > 0 ? '#DC2626' : '#15803D' });
            if (employerResult.new_total_due === 0) rows.push({ label: 'Account Status', value: 'All dues cleared!', color: '#15803D' });
        }
        if (b2bResult) {
            if (b2bResult.task_id) rows.push({ label: 'Task Remaining', value: fmt(b2bResult.new_pending), color: b2bResult.new_pending > 0 ? '#DC2626' : '#15803D' });
            rows.push({ label: 'Credit Balance', value: fmt(b2bResult.new_credit), color: '#15803D' });
        }

        await getTransporter().sendMail({
            from:    `"SNJ GlobalRoutes" <${process.env.EMAIL_FROM || 'njmit2538@gmail.com'}>`,
            to:      customerEmail,
            subject: `Payment Confirmed: ${fmt(paid)} - SNJ GlobalRoutes`,
            html:    buildEmailHtml({
                title:    'Payment Confirmation',
                subtitle: 'Your payment was successful',
                rows,
                note:    employer_id
                    ? 'Your payment has been received and your account balance updated.'
                    : 'Your payment has been credited to your B2B partner account.',
                footer:  `SNJ GlobalRoutes · Contact: directorsnj932@gmail.com`,
            }),
        });
    } catch (e) { console.error('User email error (non-fatal):', e.message); }
}