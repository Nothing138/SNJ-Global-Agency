const db = require('../config/db');

// --- ১. Active Announcement (User Side er jonno) ---
exports.getAnnouncement = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1");
        res.json({ success: true, data: rows[0] || null });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- ২. Sob announcement (Admin list er jonno) ---
exports.getAllAnnouncements = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM announcements ORDER BY created_at DESC");
        res.json({ success: true, announcements: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- ৩. Notun Announcement save kora ---
exports.saveAnnouncement = async (req, res) => {
    try {
        const { content, is_active } = req.body;
        const sql = "INSERT INTO announcements (content, is_active) VALUES (?, ?)";
        await db.execute(sql, [content, is_active ? 1 : 0]);
        res.json({ success: true, message: "New announcement added!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- ৪. Status Toggle ---
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await db.execute("UPDATE announcements SET is_active = ? WHERE id = ?", [is_active, id]);
        res.json({ success: true, message: "Status updated!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- ৫. Delete ---
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM announcements WHERE id = ?", [id]);
        res.json({ success: true, message: "Deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};