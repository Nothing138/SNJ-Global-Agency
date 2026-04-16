const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 📁 Image Upload Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/tours/';
    // Folder na thakle auto create korbe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Unique filename: tour-timestamp.jpg
    cb(null, 'tour-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// --- 🏔️ TOUR PACKAGES SECTION ---

// 1. Get all packages (Admin View - All)
router.get('/packages', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tour_packages ORDER BY id DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Get only TOP travel packages (For Homepage/Slider)
router.get('/packages/top', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tour_packages WHERE is_top = 1 AND status = 'active' ORDER BY id DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Add new package (With Image Upload & New Fields)
router.post('/add-package', upload.single('image'), async (req, res) => {
    const { title, destination, price, duration, description, itinerary, inclusions, exclusions } = req.body;
    const image_url = req.file ? `/uploads/tours/${req.file.filename}` : '';

    try {
        // Oboshoy check korben columns SQL e add kora kina
        await db.query(
            "INSERT INTO tour_packages (title, destination, price, duration, description, itinerary, inclusions, exclusions, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, destination, price, duration, description, itinerary, inclusions, exclusions, image_url]
        );
        res.json({ message: "Success!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Toggle Top Suggestion Status
router.put('/package/toggle-top/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT is_top FROM tour_packages WHERE id = ?", [req.params.id]);
        const newStatus = rows[0].is_top === 1 ? 0 : 1;
        await db.query("UPDATE tour_packages SET is_top = ? WHERE id = ?", [newStatus, req.params.id]);
        res.json({ message: newStatus === 1 ? "Added to Top" : "Removed from Top" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. Delete package
router.delete('/package/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT image_url FROM tour_packages WHERE id = ?", [req.params.id]);
        if (rows.length > 0 && rows[0].image_url) {
            const fullPath = path.join(__dirname, '..', rows[0].image_url);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        await db.query("DELETE FROM tour_packages WHERE id = ?", [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- 📝 BOOKING MANAGEMENT SECTION ---

// 6. Get all bookings with package details (Admin Dashboard)
router.get('/bookings', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT tour_bookings.*, tour_packages.title as package_name, tour_packages.destination
            FROM tour_bookings 
            JOIN tour_packages ON tour_bookings.package_id = tour_packages.id 
            ORDER BY tour_bookings.id DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 7. Update Booking Status (Confirm/Cancel)
router.put('/update-booking/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE tour_bookings SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: `Booking ${status} successfully!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;