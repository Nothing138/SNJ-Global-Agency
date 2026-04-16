// controllers/employerController.js
const db     = require('../config/db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'snj_globalroutes_secret_2026';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'njmit2538@gmail.com',
        pass: 'ayev qwgh cygc hefh'
    }
});

// ─── Helper: promise-based query ──────────────────────────────────────────────
const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([result]) => result);
    }
    if (typeof db.execute === 'function') {
        return db.execute(sql, params).then(([result]) => result);
    }
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ─── 1. Send OTP ──────────────────────────────────────────────────────────────
exports.sendOtp = async (req, res) => {
    let { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    email = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        await query(
            'INSERT INTO otp_verifications (email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = ?, created_at = NOW()',
            [email, otp, otp]
        );

        await transporter.sendMail({
            from: '"SNJ GlobalRoutes" <njmit2538@gmail.com>',
            to: email,
            subject: 'Employer Registration — Email Verification Code',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                    <div style="background:#0B1F3A;padding:24px;text-align:center;">
                        <h2 style="color:#EAB308;margin:0;font-size:22px;">SNJ GlobalRoutes</h2>
                        <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Employer Portal — Email Verification</p>
                    </div>
                    <div style="padding:32px;text-align:center;">
                        <p style="color:#0B1F3A;font-size:15px;margin-bottom:8px;">Your verification code is:</p>
                        <div style="background:#f8fafc;border:2px dashed #EAB308;border-radius:12px;padding:18px 0;margin:16px 0;">
                            <span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#0B1F3A;">${otp}</span>
                        </div>
                        <p style="color:#64748b;font-size:12px;">This code expires in <b>10 minutes</b>. Do not share it with anyone.</p>
                    </div>
                    <div style="background:#f8fafc;padding:16px;text-align:center;">
                        <p style="color:#94a3b8;font-size:11px;margin:0;">If you did not request this, please ignore this email.</p>
                    </div>
                </div>
            `
        });

        return res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        console.error('sendOtp error:', err);
        return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    }
};

// ─── 2. Register Employer ─────────────────────────────────────────────────────
exports.registerEmployer = async (req, res) => {
    let {
        company_name, industry, country, hiring_capacity, description,
        trade_license, business_reg, owner_id,
        email, phone, password, otp
    } = req.body;

    const required = { company_name, industry, country, hiring_capacity, description, trade_license, business_reg, owner_id, email, phone, password, otp };
    for (const [key, val] of Object.entries(required)) {
        if (!val?.toString().trim()) {
            return res.status(400).json({ success: false, message: `${key.replace(/_/g, ' ')} is required` });
        }
    }

    email = email.toLowerCase().trim();

    try {
        // 1. Verify OTP
        const otpRows = await query(
            'SELECT * FROM otp_verifications WHERE email = ? AND otp = ?',
            [email, otp]
        );
        if (!otpRows.length) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new code.' });
        }

        // 2. Duplicate email check
        const existing = await query('SELECT id FROM employers WHERE email = ?', [email]);
        if (existing.length) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Insert employer
        await query(
            `INSERT INTO employers
                (company_name, industry, country, hiring_capacity, description,
                 trade_license, business_reg, owner_id, email, phone, password,
                 status, is_email_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 1)`,
            [
                company_name.trim(), industry.trim(), country.trim(),
                hiring_capacity.trim(), description.trim(),
                trade_license.trim(), business_reg.trim(), owner_id.trim(),
                email, phone.trim(), hashedPassword
            ]
        );

        // 5. Clean up OTP
        await query('DELETE FROM otp_verifications WHERE email = ?', [email]);

        // 6. Notify admin (non-blocking)
        transporter.sendMail({
            from: '"SNJ GlobalRoutes" <njmit2538@gmail.com>',
            to: 'njmit2538@gmail.com',
            subject: `New Employer Registration — ${company_name}`,
            html: `<p>New employer registered: <b>${company_name}</b> (${email}). Please review in admin panel.</p>`
        }).catch(e => console.error('Admin notify email failed:', e));

        return res.status(201).json({
            success: true,
            message: 'Registration successful! Your account is pending admin approval. You will be notified via email.'
        });

    } catch (err) {
        console.error('registerEmployer error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// ─── 3. Login Employer ────────────────────────────────────────────────────────
// POST /api/employer/login
// Body: { email, password }
exports.loginEmployer = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    email = email.toLowerCase().trim();

    try {
        const rows = await query(
            'SELECT * FROM employers WHERE email = ?',
            [email]
        );

        if (!rows.length) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const employer = rows[0];

        // Check password
        const match = await bcrypt.compare(password, employer.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check account status
        if (employer.status === 'pending') {
            return res.status(403).json({ success: false, message: 'Your account is pending admin approval. Please wait for approval.' });
        }
        if (employer.status === 'rejected') {
            return res.status(403).json({ success: false, message: 'Your account has been rejected. Please contact support.' });
        }
        if (employer.status === 'blocked') {
            return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact support.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: employer.id, email: employer.email, role: 'employer' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return employer data (without password)
        const { password: _pw, ...employerData } = employer;

        return res.json({
            success: true,
            message: 'Login successful',
            token,
            employer: employerData
        });

    } catch (err) {
        console.error('loginEmployer error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// ─── 4. Get All Employers (Admin) ─────────────────────────────────────────────
exports.getAllEmployers = async (req, res) => {
    try {
        const page      = Math.max(1, parseInt(req.query.page)  || 1);
        const limit     = Math.max(1, parseInt(req.query.limit) || 10);
        const offset    = (page - 1) * limit;
        const search    = (req.query.search || '').trim();
        const status    = req.query.status || '';
        const sortBy    = ['company_name', 'email', 'country', 'industry', 'status', 'created_at'].includes(req.query.sort)
                          ? req.query.sort : 'created_at';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';

        const conditions = [];
        const params = [];

        if (search) {
            conditions.push('(company_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (status && ['pending', 'approved', 'rejected', 'blocked'].includes(status)) {
            conditions.push('status = ?');
            params.push(status);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const countRows = await query(`SELECT COUNT(*) AS total FROM employers ${where}`, params);
        const total = countRows[0]?.total || 0;

        const rows = await query(
            `SELECT id, company_name, industry, country, hiring_capacity, email, phone,
                    trade_license, business_reg, owner_id, status, is_email_verified, created_at
             FROM employers ${where}
             ORDER BY \`${sortBy}\` ${sortOrder}
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return res.json({
            success: true,
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit))
            }
        });
    } catch (err) {
        console.error('getAllEmployers error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 5. Get Single Employer ───────────────────────────────────────────────────
exports.getEmployerById = async (req, res) => {
    try {
        const rows = await query(
            `SELECT id, company_name, industry, country, hiring_capacity, description,
                    email, phone, trade_license, business_reg, owner_id,
                    status, is_email_verified, created_at
             FROM employers WHERE id = ?`,
            [parseInt(req.params.id)]
        );
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }
        return res.json({ success: true, data: rows[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 6. Update Employer Status (Admin) ───────────────────────────────────────
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'blocked'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status. Must be: pending | approved | rejected | blocked' });
    }

    try {
        const result = await query('UPDATE employers SET status = ? WHERE id = ?', [status, parseInt(id)]);
        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        // Notify employer by email (non-blocking)
        const rows = await query('SELECT email, company_name FROM employers WHERE id = ?', [parseInt(id)]);
        if (rows.length) {
            const { email, company_name } = rows[0];
            const statusMessages = {
                approved: { subject: '✅ Account Approved — SNJ GlobalRoutes',  body: `Your employer account for <b>${company_name}</b> has been <b style="color:green;">approved</b>. You can now login to the Employer Portal.` },
                rejected: { subject: '❌ Account Rejected — SNJ GlobalRoutes',  body: `Unfortunately, your employer account for <b>${company_name}</b> has been <b style="color:red;">rejected</b>. Please contact support for more information.` },
                blocked:  { subject: '🚫 Account Blocked — SNJ GlobalRoutes',   body: `Your employer account for <b>${company_name}</b> has been <b style="color:red;">blocked</b>. Please contact support.` },
                pending:  { subject: 'Account Status Updated — SNJ GlobalRoutes', body: `Your employer account for <b>${company_name}</b> status has been updated to <b>pending</b>.` },
            };
            const msg = statusMessages[status];
            transporter.sendMail({
                from: '"SNJ GlobalRoutes" <njmit2538@gmail.com>',
                to: email,
                subject: msg.subject,
                html: `<div style="font-family:Arial,sans-serif;padding:24px;max-width:480px;margin:auto;">
                           <h3 style="color:#0B1F3A;">SNJ GlobalRoutes — Employer Portal</h3>
                           <p>${msg.body}</p>
                           <p style="color:#64748b;font-size:12px;margin-top:20px;">If you have any questions, please contact us at directorsnj932@gmail.com</p>
                       </div>`
            }).catch(e => console.error('Status email failed:', e));
        }

        return res.json({ success: true, message: `Status updated to ${status}` });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 7. Delete Employer (Admin) ───────────────────────────────────────────────
exports.deleteEmployer = async (req, res) => {
    try {
        const result = await query('DELETE FROM employers WHERE id = ?', [parseInt(req.params.id)]);
        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }
        return res.json({ success: true, message: 'Employer deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};