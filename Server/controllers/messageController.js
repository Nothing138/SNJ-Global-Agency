const db = require('../config/db');

// --- Save Message (API die database e rakhar jonno) ---
exports.saveMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;
        const sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
        await db.execute(sql, [sender_id, receiver_id, message]);
        res.json({ success: true, message: "Message stored!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Get Chat History (Duijon er moddhe conversation) ---
exports.getMessages = async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const sql = `
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at ASC
        `;
        const [rows] = await db.execute(sql, [user1, user2, user2, user1]);
        res.json({ success: true, messages: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Admin er jonno Candidate list (Jader sathe chat hoise) ---
exports.getChatList = async (req, res) => {
    try {
        // Jader sathe admin (ID: 1) er kotha hoyeche tader list
        const sql = `
            SELECT DISTINCT users.id, users.full_name, users.email 
            FROM users 
            JOIN messages ON (users.id = messages.sender_id OR users.id = messages.receiver_id)
            WHERE users.id != 1
        `;
        const [users] = await db.execute(sql);
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};