const db = require('../config/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'njmit2538@gmail.com', // আপনার জিমেইল
        pass: 'ayev qwgh cygc hefh'     // গুগল থেকে জেনারেট করা ১৬ অক্ষরের অ্যাপ পাসওয়ার্ড
    }
});

// --- OTP পাঠানো ---
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // ১. আগে ইমেইলটি চেক করুন কনসোলে আসছে কিনা
        console.log("Sending OTP to:", email);

        // ২. ডাটাবেসে সেভ করার চেষ্টা
        const [result] = await db.execute('INSERT INTO otp_verifications (email, otp) VALUES (?, ?)', [email, otp]);
        
        console.log("Database Insert Result:", result);

        const mailOptions = {
            from: '"SNJ GlobalRoutes" <njmit2538@gmail.com>',
            to: email,
            subject: 'B2B Verification Code',
            text: `Your verification code is: ${otp}.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP Sent Successfully!' });
    } catch (error) {
        console.error("OTP Error:", error); // এখানে এরর প্রিন্ট হবে
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- রেজিস্ট্রেশন লজিক ---
exports.registerB2B = async (req, res) => {
    const { full_name, company_name, email, phone, purpose, num_files, country, password, otp } = req.body;

    try {
        // ১. ওটিপি চেক করা
        const [otpRecord] = await db.execute(
            'SELECT * FROM otp_verifications WHERE email = ? AND otp = ?', 
            [email, otp]
        );

        if (otpRecord.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or Expired OTP' });
        }

        // ২. ইমেইল আগে থেকেই আছে কিনা চেক
        const [existing] = await db.execute('SELECT id FROM b2b_partners WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // ৩. পাসওয়ার্ড হ্যাশ
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ৪. ডাটাবেসে সেভ করা
        const sql = `INSERT INTO b2b_partners 
          (full_name, company_name, email, phone, purpose, num_files, country, password, is_verified) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.execute(sql, [full_name, company_name, email, phone, purpose, num_files, country, hashedPassword, true]);

        // ৫. সফল হলে ওটিপি টেবিল থেকে ডাটা ডিলিট করা
        await db.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);

        res.status(201).json({ success: true, message: 'B2B Partner Registered!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllB2B = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', status = '', sort = 'created_at' } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM b2b_partners WHERE (company_name LIKE ? OR full_name LIKE ? OR email LIKE ?)`;
        let params = [`%${search}%`, `%${search}%`, `%${search}%`];

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        query += ` ORDER BY ${sort} DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.execute(query, params);
        const [total] = await db.execute('SELECT COUNT(*) as count FROM b2b_partners');

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: total[0].count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total[0].count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ২. স্ট্যাটাস আপডেট (Approve/Block ইত্যাদি)
exports.updateB2BStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE b2b_partners SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: `Partner status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৩. পার্টনার ডিলিট
exports.deleteB2B = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM b2b_partners WHERE id = ?', [id]);
        res.json({ success: true, message: 'B2B Partner removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};