const express = require('express');
const router = express.Router();
const db = require('../config/db'); // আপনার ডাটাবেস পাথ

// ১. সকল অ্যাক্টিভ ট্যুর প্যাকেজ নিয়ে আসা
router.get('/packages', async (req, res) => {
  try {
    // Shob columns fetch korbe (itinerary, inclusions, exclusions shoho)
    const [rows] = await db.query('SELECT * FROM tour_packages WHERE status = "active" ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages", error });
  }
});

// --- 2. Get Single Package Details (Details Page) ---

router.get('/packages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM tour_packages WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching package details", error });
  }
});

// 3. ট্যুর বুকিং রিকোয়েস্ট হ্যান্ডেল করা
router.post('/book', async (req, res) => {
  const { package_id, user_id } = req.body;
  try {
    const query = 'INSERT INTO tour_bookings (package_id, user_id, status) VALUES (?, ?, "pending")';
    await db.query(query, [package_id, user_id]);
    res.status(200).json({ success: true, message: "Booking request sent!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking failed", error });
  }
});

// 4. ইউজারের প্রোফাইল ডিটেইলস আনা (অটো-ফিলের জন্য)
router.get('/user-info/:userId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_details WHERE user_id = ?', [req.params.userId]);
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.json({ success: false, message: "No profile found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. ট্যুর অ্যাপ্লিকেশন সাবমিট করা
router.post('/apply-tour', async (req, res) => {
  // এখানে আপনার টেবিল স্ট্রাকচার অনুযায়ী ডেটা ইনসার্ট হবে
  // আপনি চাইলে 'tour_bookings' টেবিলে নতুন কলাম যোগ করতে পারেন অথবা আলাদা টেবিল রাখতে পারেন
  // আপাতত আমি কনসেপ্টটি দেখাচ্ছি
  const { user_id, package_id, passport_number, passport_expiry, disease, address, nationality } = req.body;
  
  try {
    const query = `INSERT INTO tour_bookings (package_id, user_id, status) VALUES (?, ?, 'pending')`;
    await db.query(query, [package_id, user_id]);
    res.json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;