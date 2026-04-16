const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register Logic ---
exports.register = async (req, res) => {
    const { full_name, email, password, role, registeredBy } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let status = 'pending';
        const autoApprovedRoles = ['superadmin', 'admin', 'hr_manager', 'candidate', 'recruiter'];
        
        if (registeredBy === 'superadmin' || autoApprovedRoles.includes(role)) {
            status = 'approved';
        }

        const sql = `INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [full_name, email, hashedPassword, role || 'candidate', status]);

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Email already exists or Database error" });
    }
};

// --- Login Logic (FIXED) ---
/*exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found!" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

        if (user.status === 'suspended') {
            return res.status(403).json({ message: "Your account is suspended!" });
        }

        if (user.role !== 'candidate' && user.role !== 'superadmin' && user.status !== 'approved') {
            return res.status(403).json({ message: "Account pending approval." });
        }

        // ✅ TOKEN SIGN (Secret key must be EXACTLY 'jmit_global_secret_2024')
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            'jmit_global_secret_2024', 
            { expiresIn: '1d' }
        );

        // ✅ Success Response (Ekhan theke extra jwt.verify muche deya hoyeche)
        res.json({
            success: true,
            token,
            role: user.role,
            user: { id: user.id, name: user.full_name, email: user.email }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};*/
/*exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // ১. ৩টি টেবিল থেকেই ইউজার খোঁজা হচ্ছে (ইমেইল দিয়ে)
        // UNION ব্যবহার করে চেক করছি ইউজার কোন টেবিলের এবং তার পুরো ডেটা কী
        const sql = `
            SELECT id, full_name, email, password, role, status, 'users' as source_table FROM users WHERE email = ?
            UNION
            SELECT id, full_name, email, password, 'b2b_partner' as role, status, 'b2b_partners' as source_table FROM b2b_partners WHERE email = ?
            UNION
            SELECT id, full_name, email, password, 'employer' as role, status, 'employers' as source_table FROM employers WHERE email = ?
        `;

        const [rows] = await db.execute(sql, [email, email, email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        const user = rows[0];

        // ২. পাসওয়ার্ড চেক (Bcrypt Compare)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // ৩. স্ট্যাটাস চেক
        if (user.status === 'suspended' || user.status === 'blocked') {
            return res.status(403).json({ message: "Your account is suspended or blocked!" });
        }

        // ৪. অ্যাপ্রুভাল চেক (বডি বা পার্টনারদের জন্য)
        // ক্যান্ডিডেট এবং সুপারঅ্যাডমিন বাদে বাকিদের স্ট্যাটাস 'approved' থাকতে হবে
        if (user.role !== 'candidate' && user.role !== 'superadmin' && user.status !== 'approved') {
            return res.status(403).json({ message: "Account pending approval." });
        }

        // ৫. টোকেন তৈরি (JWT)
        // এখানে source_table টিও টোকেনে রাখা ভালো যেন পরবর্তীতে আইডেন্টিফাই করা যায়
        const token = jwt.sign(
            { id: user.id, role: user.role, source: user.source_table }, 
            'jmit_global_secret_2024', 
            { expiresIn: '1d' }
        );

        // ৬. সাকসেস রেসপন্স
        res.json({
            success: true,
            token,
            role: user.role,
            source: user.source_table,
            user: { 
                id: user.id, 
                name: user.full_name, 
                email: user.email,
                source: user.source_table 
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};*/