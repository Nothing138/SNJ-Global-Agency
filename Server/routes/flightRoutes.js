const express = require('express');
const router = express.Router();
const db = require('../config/db');

// helper function to handle queries with async/await
const query = (sql, params) => db.query(sql, params).then(([results]) => results);

// ১. ইউজার ডিটেইলস
router.get('/user-details/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = `
            SELECT ud.first_name, ud.surname, ud.passport_number, ud.phone_number, ud.current_location as address, u.email 
            FROM user_details ud
            JOIN users u ON ud.user_id = u.id
            WHERE ud.user_id = ?`;
        const result = await query(sql, [userId]);
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: "User details not found" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ২. ফ্লাইট বুকিং রিকোয়েস্ট
router.post('/flight-request', async (req, res) => {
    try {
        const { user_id, full_name, age, email, contact_number, address, passport_number, departure_city, destination_city, travel_date, passenger_count, trip_type, policy_accepted } = req.body;
        const sql = `INSERT INTO travel_bookings 
        (user_id, full_name, age, email, contact_number, address, passport_number, departure_city, destination_city, passenger_count, travel_date, trip_type, booking_type, status, policy_accepted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'flight', 'requested', ?)`;

        const values = [user_id, full_name, age || null, email, contact_number, address, passport_number, departure_city, destination_city, passenger_count || 1, travel_date, trip_type, policy_accepted ? 1 : 0];
        const result = await query(sql, values);
        res.json({ success: true, message: "Flight request submitted!", bookingId: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৩. অ্যাডমিন: সকল রিকোয়েস্ট
router.get('/admin/flight-requests', async (req, res) => {
    try {
        const sql = "SELECT * FROM travel_bookings WHERE booking_type = 'flight' ORDER BY id DESC";
        const result = await query(sql);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৪. অ্যাডমিন: স্ট্যাটাস আপডেট
router.patch('/admin/flight-requests/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, total_cost } = req.body;
        if (status === 'accept' && (!total_cost || total_cost <= 0)) {
            return res.status(400).json({ message: "Total cost is required to accept." });
        }
        const sql = "UPDATE travel_bookings SET status = ?, total_cost = ? WHERE id = ?";
        await query(sql, [status, total_cost || 0, id]);
        res.json({ success: true, message: `Request ${status} successfully!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৫. "BOMB LEVEL" Revenue & Analytics Data
router.get('/admin/flight-analytics', async (req, res) => {
    try {
        const { range } = req.query;

        // stats
        const statsSql = `
            SELECT 
                COUNT(*) as total_flights,
                SUM(CASE WHEN status = 'accept' THEN total_cost ELSE 0 END) as total_revenue,
                COUNT(CASE WHEN status = 'accept' THEN 1 END) as confirmed_bookings,
                COUNT(CASE WHEN status = 'requested' THEN 1 END) as pending_requests
            FROM travel_bookings WHERE booking_type = 'flight'`;

        // recent list
        const recentSql = `
            SELECT full_name, destination_city, total_cost, status 
            FROM travel_bookings 
            WHERE status = 'accept' AND booking_type = 'flight'
            ORDER BY id DESC LIMIT 5`;

        // graph data
        let graphSql = "";
        if (range === 'weekly') {
            graphSql = `
                SELECT DAYNAME(travel_date) as label, SUM(total_cost) as value 
                FROM travel_bookings 
                WHERE status = 'accept' AND travel_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY DAYNAME(travel_date) ORDER BY FIELD(label, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`;
        } else {
            graphSql = `
                SELECT MONTHNAME(travel_date) as label, SUM(total_cost) as value 
                FROM travel_bookings 
                WHERE status = 'accept' AND travel_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY MONTHNAME(travel_date) ORDER BY MONTH(travel_date)`;
        }

        const [stats, recentList, graphData] = await Promise.all([
            query(statsSql),
            query(recentSql),
            query(graphSql)
        ]);

        res.json({ stats: stats[0], recentList, graphData });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৬. নির্দিষ্ট ইউজারের সব ফ্লাইট রিকোয়েস্ট এবং স্ট্যাটাস দেখা
router.get('/user-flights/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = "SELECT * FROM travel_bookings WHERE user_id = ? AND booking_type = 'flight' ORDER BY id DESC";
        const result = await query(sql, [userId]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;