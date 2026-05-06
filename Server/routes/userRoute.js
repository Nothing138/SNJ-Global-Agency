const express  = require('express');
const router   = express.Router();
const db       = require('../config/db');
const bcrypt   = require('bcryptjs');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

// ─── Multer Setup for Document Uploads ─────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads/documents');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|pdf|doc|docx/;
        const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime    = /jpeg|jpg|png|pdf|msword|vnd.openxmlformats/.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image and document files are allowed'));
    }
});

// ─── 1. Get Complete User Profile & Stats ──────────────────────────────────────
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const [user] = await db.query(`
            SELECT u.full_name, u.email, u.role, u.status AS account_status,
                   ud.*
            FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE u.id = ?
        `, [userId]);

        const [visas] = await db.query(
            `SELECT * FROM visa_applications WHERE user_id = ? ORDER BY id DESC`,
            [userId]
        );

        const [jobs] = await db.query(`
            SELECT ja.*, j.job_title, j.company_name
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            WHERE ja.candidate_id = ?
            ORDER BY ja.id DESC
        `, [userId]);

        const [tours] = await db.query(`
            SELECT tb.*, tp.title AS tour_name, tp.destination
            FROM tour_bookings tb
            JOIN tour_packages tp ON tb.package_id = tp.id
            WHERE tb.user_id = ?
            ORDER BY tb.id DESC
        `, [userId]);

        const [flights] = await db.query(`
            SELECT * FROM travel_bookings
            WHERE user_id = ? AND booking_type = 'flight'
            ORDER BY id DESC
        `, [userId]);

        res.json({
            profile: user[0] || null,
            stats:   { visas, jobs, tours, flights }
        });
    } catch (err) {
        console.error('GET /profile/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── 2. Get Applicant Tracking ─────────────────────────────────────────────────
// Returns { visa, job, flight, trip } values (0–100) from applicant_tracking table
router.get('/tracking/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [rows] = await db.query(
            `SELECT visa, job, flight, trip FROM applicant_tracking WHERE user_id = ?`,
            [userId]
        );
        if (rows.length === 0) {
            return res.json({ visa: 0, job: 0, flight: 0, trip: 0 });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('GET /tracking/:userId error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── 3. Update Profile ─────────────────────────────────────────────────────────
router.put('/profile/update', async (req, res) => {
    const {
        userId,
        full_name,
        contact_number,
        phone_number,
        passport_number,
        nid_number,
        nationality,
        address,
        current_location,
        profession
    } = req.body;

    if (!userId) return res.status(400).json({ message: 'userId is required' });

    try {
        if (full_name) {
            await db.query(`UPDATE users SET full_name = ? WHERE id = ?`, [full_name, userId]);
        }

        const phone = contact_number || phone_number || null;

        const [existing] = await db.query(
            `SELECT id FROM user_details WHERE user_id = ?`, [userId]
        );

        if (existing.length > 0) {
            await db.query(`
                UPDATE user_details
                SET
                    phone_number     = COALESCE(?, phone_number),
                    passport_number  = COALESCE(?, passport_number),
                    nid_number       = COALESCE(?, nid_number),
                    nationality      = COALESCE(?, nationality),
                    address          = COALESCE(?, address),
                    current_location = COALESCE(?, current_location),
                    profession       = COALESCE(?, profession)
                WHERE user_id = ?
            `, [phone, passport_number, nid_number, nationality, address, current_location, profession, userId]);
        } else {
            await db.query(`
                INSERT INTO user_details
                    (user_id, phone_number, passport_number, nid_number, nationality, address, current_location, profession)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [userId, phone, passport_number, nid_number, nationality, address, current_location, profession]);
        }

        res.json({ success: true, message: 'Profile updated successfully!' });
    } catch (err) {
        console.error('PUT /profile/update error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── 4. Change Password ─────────────────────────────────────────────────────────
router.put('/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [users] = await db.query(`SELECT password FROM users WHERE id = ?`, [userId]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedPass = await bcrypt.hash(newPassword, 10);
        await db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPass, userId]);

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('PUT /change-password error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ─── 5. Messaging – Send ───────────────────────────────────────────────────────
router.post('/messages/send', async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !message) {
        return res.status(400).json({ message: 'sender_id and message are required' });
    }

    const to = receiver_id || 1;

    try {
        const [result] = await db.query(
            `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
            [sender_id, to, message]
        );
        const [rows] = await db.query(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);
        res.json({ success: true, message: rows[0] });
    } catch (err) {
        console.error('POST /messages/send error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── 6. Messaging – Fetch History ─────────────────────────────────────────────
router.get('/messages/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [msgs] = await db.query(`
            SELECT * FROM messages
            WHERE (sender_id = ? AND receiver_id = 1)
               OR (sender_id = 1 AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [userId, userId]);
        res.json(msgs);
    } catch (err) {
        console.error('GET /messages/:userId error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── 7. Documents – Upload ────────────────────────────────────────────────────
router.post('/documents/upload', upload.single('document'), async (req, res) => {
    try {
        const { user_id, doc_type } = req.body;

        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        if (!user_id || !doc_type) return res.status(400).json({ message: 'user_id and doc_type required' });

        const filePath = `/uploads/documents/${req.file.filename}`;

        const [existing] = await db.query(
            `SELECT id FROM user_documents WHERE user_id = ? AND doc_type = ?`,
            [user_id, doc_type]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE user_documents
                 SET file_path = ?, original_name = ?, status = 'uploaded', uploaded_at = NOW()
                 WHERE user_id = ? AND doc_type = ?`,
                [filePath, req.file.originalname, user_id, doc_type]
            );
        } else {
            await db.query(
                `INSERT INTO user_documents (user_id, doc_type, file_path, original_name, status)
                 VALUES (?, ?, ?, ?, 'uploaded')`,
                [user_id, doc_type, filePath, req.file.originalname]
            );
        }

        res.json({ success: true, message: 'Document uploaded successfully', path: filePath });
    } catch (err) {
        console.error('POST /documents/upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── 8. Documents – Fetch ─────────────────────────────────────────────────────
router.get('/documents/:userId', async (req, res) => {
    try {
        const [docs] = await db.query(
            `SELECT * FROM user_documents WHERE user_id = ? ORDER BY uploaded_at DESC`,
            [req.params.userId]
        );
        res.json(docs);
    } catch (err) {
        console.error('GET /documents/:userId error:', err);
        res.json([]);
    }
});

module.exports = router;