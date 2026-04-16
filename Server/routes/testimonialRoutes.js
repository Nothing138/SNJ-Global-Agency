const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// 📂 Ensure folder exists logic
const uploadDir = 'public/uploads/success';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 📸 Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// 🚀 POST: Add New Testimony
router.post('/testimonials', upload.single('image'), async (req, res) => {
    const { name, designation, description } = req.body;
    const image_url = req.file ? `/uploads/success/${req.file.filename}` : null;

    try {
        const sql = "INSERT INTO testimonials (name, designation, description, image_url) VALUES (?, ?, ?, ?)";
        await db.query(sql, [name, designation, description, image_url]);
        res.json({ success: true, message: "Testimonial added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📋 GET: Fetch All Testimonials (For Frontend)
router.get('/testimonials', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM testimonials WHERE status = 'active' ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🗑️ DELETE: Testimonial remove kora
router.delete('/testimonials/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Age image-er path ta niye ashi jate file-o delete kora jay
        const [rows] = await db.query("SELECT image_url FROM testimonials WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Testimony not found!" });
        }

        // Database theke delete
        await db.query("DELETE FROM testimonials WHERE id = ?", [id]);

        // Server-er public folder theke image delete (Optional but good practice)
        const imagePath = path.join(__dirname, '../public', rows[0].image_url);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.json({ success: true, message: "Testimony deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔄 UPDATE: Testimony update kora (Status change ba data edit)
router.put('/testimonials/:id', async (req, res) => {
    const { id } = req.params;
    const { name, designation, description, status } = req.body;

    try {
        const sql = "UPDATE testimonials SET name=?, designation=?, description=?, status=? WHERE id=?";
        await db.query(sql, [name, designation, description, status || 'active', id]);
        res.json({ success: true, message: "Testimony updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;