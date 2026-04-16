const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Apnar DB connection path
const bcrypt = require('bcryptjs');

// 1. Get all staff members (Recruiter, Editor, etc.)
router.get('/all-members', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, full_name, email, role, status FROM users WHERE role != 'candidate' ORDER BY id DESC"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Update Member Status (Approved/Suspended)
router.put('/update-status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: "Status synchronized." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete Member
router.delete('/delete/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Member purged from system." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;