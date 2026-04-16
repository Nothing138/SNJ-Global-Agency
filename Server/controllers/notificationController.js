const db = require('../config/db');

// 1. Get All Notifications for the Logged-in Recruiter
exports.getNotifications = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Mark All as Read (Jokhon Bell-e click korbe)
exports.markAsRead = async (req, res) => {
    try {
        await db.execute(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [req.user.id]
        );
        res.json({ msg: "Notifications updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};