const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- 1. Get Complete User Profile & Stats (FIXED) ---
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // User and User Details join query
        const [user] = await db.query(`
            SELECT u.full_name, u.email, u.role, u.status as account_status, 
            ud.* FROM users u 
            LEFT JOIN user_details ud ON u.id = ud.user_id 
            WHERE u.id = ?`, [userId]);

        // Visa Applications
        const [visas] = await db.query(`SELECT * FROM visa_applications WHERE user_id = ?`, [userId]);

        // Job Applications
        const [jobs] = await db.query(`
            SELECT ja.*, j.job_title, j.company_name 
            FROM job_applications ja 
            JOIN jobs j ON ja.job_id = j.id 
            WHERE ja.candidate_id = ?`, [userId]);

        // Tour Bookings
        const [tours] = await db.query(`
            SELECT tb.*, tp.title, tp.destination 
            FROM tour_bookings tb 
            JOIN tour_packages tp ON tb.package_id = tp.id 
            WHERE tb.user_id = ?`, [userId]);

        // --- যোগ করা হয়েছে: Flight Bookings ---
        const [flights] = await db.query(`
            SELECT * FROM travel_bookings 
            WHERE user_id = ? AND booking_type = 'flight'
            ORDER BY id DESC`, [userId]);

        res.json({
            profile: user[0],
            stats: {
                visas: visas,
                jobs: jobs,
                tours: tours,
                flights: flights // এই ডাটাটি এখন ফ্রন্টএন্ডে যাবে
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. Update Profile ---
router.put('/profile/update', async (req, res) => {
    const { userId, full_name, contact_number, passport_number, current_location } = req.body;
    
    try {
        if (full_name) {
            await db.query(`UPDATE users SET full_name = ? WHERE id = ?`, [full_name, userId]);
        }

        await db.query(
            `UPDATE user_details 
             SET phone_number = ?, passport_number = ?, current_location = ? 
             WHERE user_id = ?`, 
            [contact_number, passport_number, current_location, userId]
        );
        
        res.json({ success: true, message: "Profile updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. Messaging Logic (Basic) ---
router.post('/messages/send', async (req, res) => {
    const { sender_id, message } = req.body;
    try {
        // Admin ID default 1 dhora hoyeche (apnar SQL onushare)
        await db.query("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, 1, ?)", [sender_id, message]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/messages/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [msgs] = await db.query(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = 1) 
            OR (sender_id = 1 AND receiver_id = ?) 
            ORDER BY created_at ASC`, [userId, userId]);
        res.json(msgs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        // 1. User ke find kora
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        // 2. Old password match kora
        const isMatch = await bcrypt.compare(oldPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        // 3. New password hash kora and save kora
        const hashedPass = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPass, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/profile/update', async (req, res) => {
    // Frontend theke userId pathano hocche, tai eikhane userId e dhorlam
    const { userId, full_name, passport_number, profession, current_location } = req.body;
    
    try {
        // Jodi full_name 'users' table e thake ar baki gula 'user_details' table e:
        // Ager code e inconsistency chilo, tai ekta single logic set korchi:
        
        // Update users table (Full Name)
        await db.query(`UPDATE users SET full_name = ? WHERE id = ?`, [full_name, userId]);

        // Update user_details table (Other Info)
        // Eikhane ensure hoye nin column name gula database er sathe mil ache kina
        await db.query(
            `UPDATE user_details 
             SET passport_number = ?, profession = ?, current_location = ? 
             WHERE user_id = ?`, 
            [passport_number, profession, current_location, userId]
        );
        
        res.json({ success: true, message: "Profile updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sync error: " + err.message });
    }
});

module.exports = router;