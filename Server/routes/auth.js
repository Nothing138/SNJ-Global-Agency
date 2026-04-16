const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Apnar database connection file

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    const { full_name, email, password, role, registeredBy } = req.body;

    try {
        // Password Hash kora
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Logic: Admin recruiter banale auto-approve, nahole pending
        let status = 'pending';
        if (registeredBy === 'superadmin' || role === 'candidate') {
            status = 'approved'; 
        }

        const query = "INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
        await db.query(query, [full_name, email, hashedPassword, role, status]);

        res.json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ROUTE ---
/*router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // ─── 1. Check users table ───
        const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (userRows.length > 0) {
            const user = userRows[0];
            if (user.status === 'suspended') return res.status(403).json({ message: "Your account is suspended!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign(
                { id: user.id, role: user.role, source: 'users' },
                process.env.JWT_SECRET || 'jmit_global_secret_2024',
                { expiresIn: '1d' }
            );

            let redirectTo = '/';
            if (['superadmin', 'admin', 'hr_manager', 'moderator', 'recruiter'].includes(user.role)) redirectTo = '/admin/dashboard';
            else if (user.role === 'employee') redirectTo = '/employer/dashboard';

            return res.json({
                success: true,
                token,
                role: user.role,
                source: 'users',
                redirectTo,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        }

        // ─── 2. Check b2b_partners table ───
        const [b2bRows] = await db.query("SELECT * FROM b2b_partners WHERE email = ?", [email]);
        if (b2bRows.length > 0) {
            const partner = b2bRows[0];
            if (!partner.is_verified || partner.status !== 'approved') {
                return res.status(403).json({ message: "B2B account not verified or pending approval." });
            }

            const isMatch = await bcrypt.compare(password, partner.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign(
                { id: partner.id, role: 'b2b_partner', source: 'b2b_partners' },
                process.env.JWT_SECRET || 'jmit_global_secret_2024',
                { expiresIn: '1d' }
            );

            return res.json({
                success: true,
                token,
                role: 'b2b_partner',
                source: 'b2b_partners',
                redirectTo: '/b2b/dashboard',
                user: { id: partner.id, name: partner.full_name, email: partner.email, role: 'b2b_partner' }
            });
        }

        // ─── 3. Check employers table (এই পার্টটি আপনার কোডে মিসিং ছিল) ───
        const [employerRows] = await db.query("SELECT * FROM employers WHERE email = ?", [email]);
        if (employerRows.length > 0) {
            const employer = employerRows[0];
            
            if (employer.status !== 'approved') {
                return res.status(403).json({ message: "Employer account pending approval." });
            }

            const isMatch = await bcrypt.compare(password, employer.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign(
                { id: employer.id, role: 'employer', source: 'employers' },
                process.env.JWT_SECRET || 'jmit_global_secret_2024',
                { expiresIn: '1d' }
            );

            return res.json({
                success: true,
                token,
                role: 'employer',
                source: 'employers',
                redirectTo: '/employer/dashboard', // আপনার প্রয়োজন অনুযায়ী পথ পরিবর্তন করতে পারেন
                user: { id: employer.id, name: employer.full_name, email: employer.email, role: 'employer' }
            });
        }

        // ─── 4. Not found in any table ───
        return res.status(400).json({ message: "User not found" });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: err.message });
    }
});*/

// authRoutes.js — login route (fixed)
// এই পুরো router.post('/login', ...) block টা তোমার existing auth route file এ replace করো

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        // ─── 1. Check users table ─────────────────────────────────────────────
        const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
        if (userRows.length > 0) {
            const user = userRows[0];

            if (user.status === 'suspended') {
                return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password.' });

            const token = jwt.sign(
                { id: user.id, role: user.role, source: 'users' },
                process.env.JWT_SECRET || 'jmit_global_secret_2024',
                { expiresIn: '1d' }
            );

            let redirectTo = '/';
            if (['superadmin', 'admin', 'hr_manager', 'moderator', 'recruiter'].includes(user.role)) redirectTo = '/admin/dashboard';
            else if (user.role === 'employee') redirectTo = '/employer/dashboard';

            return res.json({
                success: true,
                token,
                role: user.role,
                source: 'users',
                redirectTo,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        }

        // ─── 2. Check b2b_partners table ─────────────────────────────────────
        const [b2bRows] = await db.query('SELECT * FROM b2b_partners WHERE email = ?', [email.toLowerCase()]);
        if (b2bRows.length > 0) {
            const partner = b2bRows[0];

            // ✅ status must be 'approved' — pending/rejected/blocked সব ব্লক
            if (partner.status !== 'approved') {
                const msg = {
                    pending:  'Your B2B partner account is pending admin approval. Please wait.',
                    rejected: 'Your B2B partner account has been rejected. Please contact support.',
                    blocked:  'Your B2B partner account has been blocked. Please contact support.',
                };
                return res.status(403).json({
                    success: false,
                    message: msg[partner.status] || 'Account not approved. Please contact support.'
                });
            }

            if (!partner.is_verified) {
                return res.status(403).json({ success: false, message: 'Your email is not verified. Please verify and try again.' });
            }

            const isMatch = await bcrypt.compare(password, partner.password);
            if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password.' });

            const token = jwt.sign(
                { id: partner.id, role: 'b2b_partner', source: 'b2b_partners' },
                process.env.JWT_SECRET || 'jmit_global_secret_2024',
                { expiresIn: '1d' }
            );

            return res.json({
                success: true,
                token,
                role: 'b2b_partner',
                source: 'b2b_partners',
                redirectTo: '/b2b/dashboard',
                user: { id: partner.id, name: partner.full_name, email: partner.email, role: 'b2b_partner' }
            });
        }

        // ─── 3. Check employers table ─────────────────────────────────────────
        const [employerRows] = await db.query('SELECT * FROM employers WHERE email = ?', [email.toLowerCase()]);
        if (employerRows.length > 0) {
            const employer = employerRows[0];

            // ✅ status must be 'approved' — pending/rejected/blocked সব ব্লক
            if (employer.status !== 'approved') {
                const msg = {
                    pending:  'Your employer account is pending admin approval. You will be notified via email once approved.',
                    rejected: 'Your employer account has been rejected. Please contact support for more information.',
                    blocked:  'Your employer account has been blocked. Please contact support.',
                };
                return res.status(403).json({
                    success: false,
                    message: msg[employer.status] || 'Account not approved. Please contact support.'
                });
            }

            if (!employer.is_email_verified) {
                return res.status(403).json({ success: false, message: 'Your email address is not verified.' });
            }

            const isMatch = await bcrypt.compare(password, employer.password);
            if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password.' });

            const token = jwt.sign(
                { id: employer.id, role: 'employer', source: 'employers' },
                process.env.JWT_SECRET || 'jmit_global_secret_2024',
                { expiresIn: '1d' }
            );

            return res.json({
                success: true,
                token,
                role: 'employer',
                source: 'employers',
                redirectTo: '/employer/dashboard',
                user: {
                    id: employer.id,
                    name: employer.company_name,   // employers table এ full_name নেই, company_name আছে
                    email: employer.email,
                    role: 'employer'
                }
            });
        }

        // ─── 4. Not found in any table ────────────────────────────────────────
        return res.status(404).json({ success: false, message: 'No account found with this email address.' });

    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});


module.exports = router;