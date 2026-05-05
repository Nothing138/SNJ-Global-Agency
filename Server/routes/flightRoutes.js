// routes/flightRoutes.js — FINAL FIXED VERSION
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const query = (sql, params) => db.query(sql, params).then(([results]) => results);

// ─── Nodemailer Setup (Safe) ───────────────────────────────────────
let transporter = null;
try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const nodemailer = require('nodemailer');
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('✅ Email transporter initialized');
    } else {
        console.warn('⚠️ Email credentials missing — emails disabled');
    }
} catch (err) {
    console.warn('⚠️ Nodemailer error:', err.message);
}

// ─── Email Helper ──────────────────────────────────────────────────
const sendFlightEmails = async ({ bookingId, full_name, email, trip_type, departure_city, destination_city, travel_date, passenger_count, multi_city_legs }) => {
    if (!transporter) return;

    const tripLabel = { oneway: 'One Way', roundtrip: 'Round Trip', multicity: 'Multi City' }[trip_type] || trip_type;

    let legsHtml = '';
    if (trip_type === 'multicity' && multi_city_legs) {
        try {
            const legs = typeof multi_city_legs === 'string' ? JSON.parse(multi_city_legs) : multi_city_legs;
            legsHtml = `
                <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                    <tr style="background:#0B1F3A;color:white;">
                        <th style="padding:8px;text-align:left;font-size:11px;">#</th>
                        <th style="padding:8px;text-align:left;font-size:11px;">From</th>
                        <th style="padding:8px;text-align:left;font-size:11px;">To</th>
                        <th style="padding:8px;text-align:left;font-size:11px;">Date</th>
                    </tr>
                    ${legs.map((leg, i) => `
                    <tr style="border-bottom:1px solid #E5E7EB;">
                        <td style="padding:8px;font-size:12px;">${i + 1}</td>
                        <td style="padding:8px;font-size:12px;">${leg.departure_city}</td>
                        <td style="padding:8px;font-size:12px;">${leg.destination_city}</td>
                        <td style="padding:8px;font-size:12px;">${leg.travel_date}</td>
                    </tr>`).join('')}
                </table>`;
        } catch (e) { /* skip */ }
    }

    const routeInfo = trip_type === 'multicity'
        ? legsHtml
        : `<p style="margin:4px 0;font-size:14px;">📍 <b>${departure_city || '-'}</b> → <b>${destination_city || '-'}</b></p>
           <p style="margin:4px 0;font-size:14px;">📅 Date: <b>${travel_date || '-'}</b></p>`;

    const userMail = {
        from: `"SNJ Global Agency ✈️" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject: `✈️ Flight Request Received — Booking #${bookingId}`,
        html: `
        <div style="font-family:'Times New Roman',serif;max-width:600px;margin:0 auto;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">
            <div style="background:#0B1F3A;padding:32px;text-align:center;">
                <h1 style="color:#EAB308;margin:0;font-size:28px;letter-spacing:2px;">SNJ GLOBAL</h1>
                <p style="color:white;margin:8px 0 0;font-size:13px;letter-spacing:4px;">TRAVEL & AGENCY</p>
            </div>
            <div style="padding:32px;">
                <h2 style="color:#0B1F3A;margin-top:0;">Dear ${full_name},</h2>
                <p style="color:#64748B;line-height:1.7;">Your flight request has been successfully received. Our team will review your request and contact you within <b>24-48 hours</b>.</p>
                <div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin:24px 0;">
                    <h3 style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:3px;color:#0B1F3A;">Booking Summary</h3>
                    <p style="margin:4px 0;font-size:14px;">🎫 Booking ID: <b>#${bookingId}</b></p>
                    <p style="margin:4px 0;font-size:14px;">🛫 Trip Type: <b>${tripLabel}</b></p>
                    <p style="margin:4px 0;font-size:14px;">👥 Passengers: <b>${passenger_count}</b></p>
                    ${routeInfo}
                </div>
                <p style="color:#64748B;font-size:13px;">Need assistance? WhatsApp us or reply to this email.</p>
            </div>
            <div style="background:#F8FAFC;padding:20px;text-align:center;border-top:1px solid #E5E7EB;">
                <p style="color:#64748B;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:2px;">SNJ Global Agency • Premium Travel Services</p>
            </div>
        </div>`
    };

    const adminMail = {
        from: `"SNJ Booking System" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 New Flight Request #${bookingId} — ${full_name}`,
        html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:24px;">
            <h2 style="color:#0B1F3A;border-bottom:2px solid #EAB308;padding-bottom:12px;">🛫 New Flight Request</h2>
            <table style="width:100%;font-size:13px;">
                <tr><td style="padding:6px 0;color:#64748B;width:40%;">Booking ID</td><td><b>#${bookingId}</b></td></tr>
                <tr><td style="padding:6px 0;color:#64748B;">Name</td><td><b>${full_name}</b></td></tr>
                <tr><td style="padding:6px 0;color:#64748B;">Email</td><td>${email}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B;">Trip Type</td><td><b>${tripLabel}</b></td></tr>
                <tr><td style="padding:6px 0;color:#64748B;">Passengers</td><td>${passenger_count}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B;">Route</td><td><b>${departure_city || 'Multi-City'} → ${destination_city || 'See legs'}</b></td></tr>
                <tr><td style="padding:6px 0;color:#64748B;">Date</td><td>${travel_date || 'See legs'}</td></tr>
            </table>
            ${trip_type === 'multicity' ? `<h3 style="margin-top:16px;font-size:12px;color:#0B1F3A;">Multi-City Legs:</h3>${legsHtml}` : ''}
        </div>`
    };

    await Promise.allSettled([
        transporter.sendMail(userMail),
        transporter.sendMail(adminMail)
    ]);
};

// ─── Routes ──────────────────────────────────────────────────────

// ১. User Details
router.get('/user-details/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // undefined বা non-numeric হলে early return
        if (!userId || userId === 'undefined' || isNaN(Number(userId))) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const sql = `
            SELECT ud.first_name, ud.surname, ud.passport_number, ud.phone_number, 
                   ud.current_location as address, u.email 
            FROM user_details ud
            JOIN users u ON ud.user_id = u.id
            WHERE ud.user_id = ?`;
        const result = await query(sql, [userId]);
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: "User details not found" });
    } catch (err) {
        console.error('user-details error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ২. Flight Booking Request
router.post('/flight-request', async (req, res) => {
    try {
        const {
            user_id, full_name, age, email, contact_number, address, passport_number,
            departure_city, destination_city, passenger_count,
            travel_date, return_date, trip_type, policy_accepted, multi_city_legs
        } = req.body;

        // Required fields check
        if (!full_name || !email || !contact_number || !passport_number) {
            return res.status(400).json({ message: "Required fields: full_name, email, contact_number, passport_number" });
        }

        // travel_date: multi-city তে legs থেকে নেওয়া হবে
        // DB তে travel_date NOT NULL — তাই একটা valid date দিতেই হবে
        let finalTravelDate = travel_date || null;
        let finalDeparture = departure_city || null;
        let finalDestination = destination_city || null;
        let finalLegs = null;

        if (trip_type === 'multicity' && multi_city_legs) {
            try {
                const legs = typeof multi_city_legs === 'string' ? JSON.parse(multi_city_legs) : multi_city_legs;
                // Validate করো JSON সঠিক কিনা
                if (!Array.isArray(legs) || legs.length === 0) {
                    return res.status(400).json({ message: "Invalid multi-city legs data" });
                }
                finalTravelDate = legs[0]?.travel_date || null;
                finalDeparture = legs[0]?.departure_city || null;
                finalDestination = legs[legs.length - 1]?.destination_city || null;
                // DB এ valid JSON string পাঠাও
                finalLegs = JSON.stringify(legs);
            } catch (e) {
                return res.status(400).json({ message: "Invalid multi_city_legs JSON format" });
            }
        }

        // travel_date NOT NULL constraint — null হলে আজকের date দাও
        if (!finalTravelDate) {
            finalTravelDate = new Date().toISOString().split('T')[0];
        }

        const sql = `INSERT INTO travel_bookings 
            (user_id, full_name, age, email, contact_number, address, passport_number, 
             departure_city, destination_city, passenger_count, travel_date, return_date,
             trip_type, booking_type, status, policy_accepted, multi_city_legs) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'flight', 'requested', ?, ?)`;

        const values = [
            user_id || null,
            full_name,
            age || null,
            email,
            contact_number,
            address || null,
            passport_number,
            finalDeparture,
            finalDestination,
            passenger_count || 1,
            finalTravelDate,
            return_date || null,
            trip_type || 'oneway',
            policy_accepted ? 1 : 0,
            finalLegs
        ];

        const result = await query(sql, values);
        const bookingId = result.insertId;

        // Email background এ
        sendFlightEmails({
            bookingId, full_name, email, trip_type,
            departure_city: finalDeparture,
            destination_city: finalDestination,
            travel_date: finalTravelDate,
            passenger_count, multi_city_legs: finalLegs
        }).catch(err => console.error('Email error (non-fatal):', err.message));

        console.log(`✅ Flight #${bookingId} saved — ${full_name} (${trip_type})`);
        res.json({ success: true, message: "Flight request submitted!", bookingId });

    } catch (err) {
        console.error('❌ Flight request DB error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ৩. Admin: All Requests
router.get('/admin/flight-requests', async (req, res) => {
    try {
        res.json(await query("SELECT * FROM travel_bookings WHERE booking_type = 'flight' ORDER BY id DESC"));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৪. Admin: Status Update
router.patch('/admin/flight-requests/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, total_cost } = req.body;
        if (status === 'accept' && (!total_cost || total_cost <= 0)) {
            return res.status(400).json({ message: "Total cost is required to accept." });
        }
        await query("UPDATE travel_bookings SET status = ?, total_cost = ? WHERE id = ?", [status, total_cost || 0, id]);
        res.json({ success: true, message: `Request ${status} successfully!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৫. Analytics
router.get('/admin/flight-analytics', async (req, res) => {
    try {
        const { range } = req.query;
        const [stats, recentList, graphData] = await Promise.all([
            query(`SELECT COUNT(*) as total_flights,
                SUM(CASE WHEN status='accept' THEN total_cost ELSE 0 END) as total_revenue,
                COUNT(CASE WHEN status='accept' THEN 1 END) as confirmed_bookings,
                COUNT(CASE WHEN status='requested' THEN 1 END) as pending_requests
                FROM travel_bookings WHERE booking_type='flight'`),
            query(`SELECT full_name, destination_city, total_cost, status 
                FROM travel_bookings WHERE status='accept' AND booking_type='flight'
                ORDER BY id DESC LIMIT 5`),
            range === 'weekly'
                ? query(`SELECT DAYNAME(travel_date) as label, SUM(total_cost) as value 
                    FROM travel_bookings WHERE status='accept' AND travel_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                    GROUP BY DAYNAME(travel_date) ORDER BY FIELD(label,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')`)
                : query(`SELECT MONTHNAME(travel_date) as label, SUM(total_cost) as value 
                    FROM travel_bookings WHERE status='accept' AND travel_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                    GROUP BY MONTHNAME(travel_date) ORDER BY MONTH(travel_date)`)
        ]);
        res.json({ stats: stats[0], recentList, graphData });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৬. User's own flights
router.get('/user-flights/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || userId === 'undefined' || isNaN(Number(userId))) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        res.json(await query(
            "SELECT * FROM travel_bookings WHERE user_id = ? AND booking_type = 'flight' ORDER BY id DESC",
            [userId]
        ));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;