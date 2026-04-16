const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { getPendingRecruiters, approveRecruiter } = require('../controllers/adminController');

router.get('/pending-recruiters', getPendingRecruiters); 
router.put('/approve-recruiter/:id', approveRecruiter); 

// --- Image Storage Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/country/';
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Unique filename: country-timestamp.jpg
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- 1. DASHBOARD SUMMARY ---
router.get('/dashboard-stats', async (req, res) => {
    try {
        const [visaReq] = await db.query("SELECT COUNT(*) as count FROM visa_applications");
        const [jobs] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'candidate'");
        const [packages] = await db.query("SELECT COUNT(*) as count FROM travel_bookings");

        res.json({
            visaRequests: visaReq[0].count,
            activeJobs: jobs[0].count,
            totalClients: users[0].count,
            tourPackages: packages[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. VISA CATEGORIES ---
router.get('/visa-categories', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visa_categories ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/visa-categories', async (req, res) => {
    const { category_name } = req.body;
    if (!category_name) return res.status(400).json({ success: false, message: "Name is missing!" });
    try {
        const sql = "INSERT INTO visa_categories (category_name) VALUES (?)";
        await db.query(sql, [category_name]);
        res.status(201).json({ success: true, message: "Added!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/visa-categories/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM visa_categories WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Category deleted!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/visa-categories/:id', async (req, res) => {
    const { category_name } = req.body;
    try {
        await db.query("UPDATE visa_categories SET category_name = ? WHERE id = ?", [category_name, req.params.id]);
        res.json({ success: true, message: "Category updated!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 3. COUNTRY LIST (FIXED JOIN & ROUTES) ---

// FETCH ALL COUNTRIES WITH CATEGORY NAME
router.get('/visa-countries', async (req, res) => {
    try {
        const query = `
            SELECT 
                vc.id, 
                vc.country_name, 
                vc.application_charge, 
                vc.status, 
                vc.category_id,
                vc.image_url,   
                vc.is_top,      
                cat.category_name 
            FROM visa_countries vc
            LEFT JOIN visa_categories cat ON vc.category_id = cat.id
            ORDER BY vc.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD COUNTRY LINKED WITH CATEGORY
/*router.post('/visa-countries', upload.single('image'), async (req, res) => {
    const { country_name, category_id, application_charge } = req.body;
    
    // Check koren req.file asholei asche ki na
    console.log("File Data:", req.file); 

    const image_url = req.file ? `/uploads/country/${req.file.filename}` : null;
    
    try {
        const sql = "INSERT INTO visa_countries (country_name, category_id, application_charge, status, image_url, is_top) VALUES (?, ?, ?, 'active', ?, 0)";
        await db.query(sql, [country_name, category_id, application_charge, image_url]);
        res.json({ success: true, message: "Added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/
router.post('/visa-countries', upload.single('image'), async (req, res) => {
    const { 
        country_name, category_id, application_charge, 
        duration, process_time, description, 
        requirements, benefits, procedures 
    } = req.body;

    const image_url = req.file ? `/uploads/country/${req.file.filename}` : null;
    
    try {
        const sql = `INSERT INTO visa_countries 
        (country_name, category_id, application_charge, status, image_url, is_top, duration, process_time, description, requirements, benefits, procedures) 
        VALUES (?, ?, ?, 'active', ?, 0, ?, ?, ?, ?, ?, ?)`;
        
        await db.query(sql, [
            country_name, category_id, application_charge, image_url, 
            duration || '2 Years', process_time || '3 Months', 
            description, requirements, benefits, procedures
        ]);
        
        res.json({ success: true, message: "Visa Route Created Successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update Price Only
router.put('/visa-countries/price/:id', async (req, res) => {
    const { application_charge } = req.body;
    try {
        await db.query("UPDATE visa_countries SET application_charge = ? WHERE id = ?", [application_charge, req.params.id]);
        res.json({ success: true, message: "Price updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Toggle Status (Active/Inactive)
router.put('/visa-countries/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE visa_countries SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Country is now ${status}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Country
router.delete('/visa-countries/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM visa_countries WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// TOGGLE TOP STATUS 
router.put('/visa-countries/toggle-top/:id', async (req, res) => {
    const { is_top } = req.body; // is_top: 1 or 0
    try {
        await db.query("UPDATE visa_countries SET is_top = ? WHERE id = ?", [is_top, req.params.id]);
        res.json({ success: true, message: is_top ? "Marked as Top Suggestion" : "Removed from Top" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// FETCH TOP SUGGESTIONS 
router.get('/visa-countries/top', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT vc.*, cat.category_name 
            FROM visa_countries vc
            LEFT JOIN visa_categories cat ON vc.category_id = cat.id
            WHERE vc.is_top = 1 AND vc.status = 'active'
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. VISA APPLICATIONS ---
router.get('/visa-applications', async (req, res) => {
    try {
        const query = `
            SELECT va.*, u.full_name, vc.category_name as visa_type_name, vct.application_charge 
            FROM visa_applications va
            JOIN users u ON va.user_id = u.id
            LEFT JOIN visa_categories vc ON va.category_id = vc.id
            LEFT JOIN visa_countries vct ON va.country_id = vct.id
            ORDER BY va.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Application Status & Payment
router.put('/visa-applications/:id', async (req, res) => {
    const { application_status, payment_status } = req.body;
    try {
        await db.query(
            "UPDATE visa_applications SET application_status = ?, payment_status = ? WHERE id = ?",
            [application_status, payment_status, req.params.id]
        );
        res.json({ success: true, message: "Application updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Application
router.delete('/visa-applications/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM visa_applications WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Application deleted!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 5. Agency Blog ---
// Upload Blog
router.post('/blogs', async (req, res) => {
    const { author_id, title, content, featured_image } = req.body;
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    try {
        await db.query(
            "INSERT INTO blogs (author_id, title, slug, content, featured_image) VALUES (?, ?, ?, ?, ?, 'published')",
            [author_id || 1, title, slug, content, featured_image]
        );
        res.json({ success: true, message: "Blog posted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Blogs
/*router.get('/blogs', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM blogs ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

router.get('/blogs', async (req, res) => {
    try {
        // SQL query order by latest first
        const [rows] = await db.query("SELECT * FROM blogs ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update Blog
router.put('/blogs/:id', async (req, res) => {
    const { title, content, featured_image } = req.body;
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    try {
        await db.query(
            "UPDATE blogs SET title = ?, slug = ?, content = ?, featured_image = ? WHERE id = ?",
            [title, slug, content, featured_image, req.params.id]
        );
        res.json({ success: true, message: "Blog updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Blog
router.delete('/blogs/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Blog deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Blog by Slug
router.get('/blogs/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM blogs WHERE slug = ?", [slug]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        
        res.json(rows[0]); // Shudhu single blog-ta pathabo
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 6. JOB CIRCULAR
// POST A JOB ---
router.post('/jobs', async (req, res) => {
    const { title, company_name, location, salary, job_type, description, recruiter_id } = req.body;
    try {
        await db.query(
            "INSERT INTO jobs (title, company_name, location, salary, job_type, description, recruiter_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')",
            [title, company_name, location, salary, job_type, description, recruiter_id || 1]
        );
        res.json({ success: true, message: "Job Posted Successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

//  GET APPLIED CANDIDATES ---
router.get('/applied-candidates', async (req, res) => {
    try {
        const query = `
            SELECT 
                ja.id, 
                ja.status, 
                ja.application_date AS created_at, 
                ja.full_name, 
                ja.cv_url AS resume_url, 
                COALESCE(j.job_title, 'Job Deleted') AS job_title, 
                u.email 
            FROM job_applications ja
            LEFT JOIN jobs j ON ja.job_id = j.id
            LEFT JOIN users u ON ja.candidate_id = u.id
            ORDER BY ja.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { 
        console.error("Backend Error:", err.message);
        res.status(500).json({ error: "Database query failed" }); 
    }
});

// GET RECRUITER LIST & HIRE COUNT ---
router.get('/recruiters', async (req, res) => {
    try {
        const query = `
            SELECT r.*, 
            (SELECT COUNT(*) FROM jobs WHERE recruiter_id = r.id) as total_jobs,
            (SELECT COUNT(*) FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = r.id AND ja.status = 'hired') as total_hired
            FROM recruiters r
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 7. Applied Candidates
// Update Application Status (Shortlisted/Hired/Rejected)
router.patch('/applications/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE job_applications SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Candidate ${status} successfully!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Application
router.delete('/applications/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM job_applications WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Application removed from database" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 8. Recruiter List
// Get All Recruiters (Pending + Approved) with Activity Stats
router.get('/recruiters/manage', async (req, res) => {
    try {
        const query = `
            SELECT r.*, 
            COUNT(DISTINCT j.id) as total_jobs,
            COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count,
            COUNT(CASE WHEN ja.status = 'rejected' THEN 1 END) as rejected_count,
            COUNT(CASE WHEN ja.status = 'pending' THEN 1 END) as pending_count
            FROM recruiters r
            LEFT JOIN jobs j ON r.id = j.recruiter_id
            LEFT JOIN job_applications ja ON j.id = ja.job_id
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Recruiter Status (Approve / Suspend / Active)
router.patch('/recruiters/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE recruiters SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Recruiter status updated to ${status}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Recruiter
router.delete('/recruiters/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM recruiters WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Analytics Stats
router.get('/stats', async (req, res) => {
    try {
        const { filter = 'month' } = req.query; // 'week' or 'month' filter ashe frontend theke

       
        const [users] = await db.query("SELECT COUNT(*) as total FROM users WHERE role = 'candidate'");
        const [jobs] = await db.query("SELECT COUNT(*) as total FROM jobs");
        const [apps] = await db.query("SELECT COUNT(*) as total FROM job_applications");
        const [revenue] = await db.query(`
            SELECT SUM(p.price) as total FROM tour_bookings b 
            JOIN tour_packages p ON b.package_id = p.id
        `);

        
        let chartQuery = "";
        if (filter === 'week') {
            
            chartQuery = `
                SELECT DAYNAME(b.booking_date) as label, SUM(p.price) as income
                FROM tour_bookings b
                JOIN tour_packages p ON b.package_id = p.id
                WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY label, b.booking_date 
                ORDER BY b.booking_date ASC`;
        } else {
            
            chartQuery = `
                SELECT MONTHNAME(b.booking_date) as label, SUM(p.price) as income
                FROM tour_bookings b
                JOIN tour_packages p ON b.package_id = p.id
                GROUP BY label, MONTH(b.booking_date)
                ORDER BY MONTH(b.booking_date) ASC LIMIT 6`;
        }
        const [chartData] = await db.query(chartQuery);

        
        const [visaStats] = await db.query(`
            SELECT 
                COUNT(*) as total_apps,
                SUM(CASE WHEN application_status = 'approved' THEN 1 ELSE 0 END) as approved_apps
            FROM visa_applications
        `);
        const successRate = visaStats[0].total_apps > 0 
            ? Math.round((visaStats[0].approved_apps / visaStats[0].total_apps) * 100) 
            : 0;

        
        const [recentBookings] = await db.query(`
            SELECT b.id, u.full_name as client_name, p.title as package, p.price, b.status 
            FROM tour_bookings b 
            JOIN users u ON b.user_id = u.id 
            JOIN tour_packages p ON b.package_id = p.id 
            ORDER BY b.id DESC LIMIT 8
        `);

        
        res.json({
            success: true,
            stats: {
                totalUsers: users[0].total,
                totalJobs: jobs[0].total,
                totalApps: apps[0].total,
                totalRevenue: revenue[0].total || 0,
                visaSuccess: successRate
            },
            chartData: chartData || [],
            recentBookings: recentBookings || []
        });

    } catch (err) {
        console.error("Critical Analytics Error:", err);
        res.status(500).json({ success: false, error: "Database synchronization failed." });
    }
});

// --- INCOME CHART DATA (WEEKLY/MONTHLY) ---
router.get('/income-chart', async (req, res) => {
    const { filter } = req.query; // 'week' or 'month'
    try {
        let query = "";
        if (filter === 'week') {
            
            query = `
                SELECT DAYNAME(b.booking_date) as label, SUM(p.price) as income
                FROM tour_bookings b
                JOIN tour_packages p ON b.package_id = p.id
                WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY label ORDER BY b.booking_date ASC`;
        } else {
            
            query = `
                SELECT MONTHNAME(b.booking_date) as label, SUM(p.price) as income
                FROM tour_bookings b
                JOIN tour_packages p ON b.package_id = p.id
                GROUP BY label, MONTH(b.booking_date)
                ORDER BY MONTH(b.booking_date) ASC LIMIT 6`;
        }

        const [rows] = await db.query(query);
        res.json({ success: true, chartData: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 9. NOTIFICATION & BROADCAST ---

// 1. Get all Unique Conversations for Admin Inbox
router.get('/inbox-summary', async (req, res) => {
    try {
        const query = `
            SELECT m.*, u.full_name, u.email 
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id IN (SELECT MAX(id) FROM messages GROUP BY sender_id)
            ORDER BY m.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Inbox sync failed" });
    }
});

// 2. Send Message (Admin to User)
router.post('/messages/send', async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    try {
        await db.query(
            "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
            [sender_id, receiver_id, message]
        );
        res.json({ success: true, message: "Message dispatched!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Post Global Notification (Push Alert)
router.post('/notifications', async (req, res) => {
    const { title, message, type } = req.body;
    try {
        await db.query(
            "INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)",
            [title, message, type]
        );
        res.json({ success: true, message: "Broadcast is now live!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get Latest Notifications for Sidebar/Bell
router.get('/notifications/latest', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM notifications ORDER BY id DESC LIMIT 10");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Unread Notification Count for Bell Icon
router.get('/notifications/unread-count', async (req, res) => {
    try {
        // Eikhane dhore neya hochhe 'is_read' column ta table-e ase
        // Jodi is_read column na thake, tahole shudhu total count pathabe
        const [rows] = await db.query("SELECT COUNT(*) as unreadCount FROM notifications");
        res.json({ count: rows[0].unreadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a specific notification
router.delete('/notifications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM notifications WHERE id = ?", [id]);
        
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Notification purged from system." });
        } else {
            res.status(404).json({ error: "Notification not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/*
// Pending Recruiter-der list dekha
exports.getPendingRecruiters = async (req, res) => {
    try {
        // Table-er column name gulo jeno 'full_name', 'email', 'role', 'status' e thake
        const [rows] = await db.execute(
            "SELECT id, full_name, email, status FROM users WHERE role = 'recruiter' AND status = 'pending'"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Recruiter Approve kora
exports.approveRecruiter = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("UPDATE users SET status = 'approved' WHERE id = ?", [id]);
        res.json({ success: true, message: "Recruiter approved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/

//forgot password
// 1. Password check korar logic (MySQL Version)
/*router.post('/check-user', async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ exists: false, message: "User not found" });
        }
        
        res.status(200).json({ exists: true });
    } catch (err) {
        console.error("Check User Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});*/
router.post('/check-user', async (req, res) => {
    const { email } = req.body;
    try {
        // ৩টি টেবিল থেকেই চেক করা হচ্ছে ইমেইলটি আছে কি না
        const sql = `
            SELECT 'users' as table_name FROM users WHERE email = ?
            UNION
            SELECT 'b2b_partners' as table_name FROM b2b_partners WHERE email = ?
            UNION
            SELECT 'employers' as table_name FROM employers WHERE email = ?
        `;
        
        const [rows] = await db.query(sql, [email, email, email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ exists: false, message: "No account found with this email!" });
        }
        
        // ইউজার পাওয়া গেছে
        res.status(200).json({ exists: true });
    } catch (err) {
        console.error("Check User Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 2. Password update korar logic (MySQL Version)
/*router.put('/reset-password-direct', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        // Step 1: Password hash kora (Security-r jonno)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Step 2: MySQL Query chalanu
        const [result] = await db.query(
            "UPDATE users SET password = ? WHERE email = ?", 
            [hashedPassword, email]
        );

        // affectedRows mane holo database-e password change hoyeche kina
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Update Error Details:", err); // Eita backend console-e error dekhabe
        res.status(500).json({ message: "Failed to update password", error: err.message });
    }
});*/
router.put('/reset-password-direct', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        // ১. পাসওয়ার্ড হ্যাশ করা
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // ২. চেক করা ইমেইলটি কোন টেবিলে আছে
        const checkSql = `
            SELECT 'users' as tbl FROM users WHERE email = ?
            UNION
            SELECT 'b2b_partners' as tbl FROM b2b_partners WHERE email = ?
            UNION
            SELECT 'employers' as tbl FROM employers WHERE email = ?
        `;
        const [foundIn] = await db.query(checkSql, [email, email, email]);

        if (foundIn.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // ৩. লুপ চালিয়ে যে যে টেবিলে এই ইমেইল আছে সবগুলোতে আপডেট করা 
        // (যদি একই ইমেইল একাধিক টেবিলে থাকে তবে সবখানেই আপডেট হবে)
        for (let row of foundIn) {
            const targetTable = row.tbl;
            await db.query(
                `UPDATE ${targetTable} SET password = ? WHERE email = ?`, 
                [hashedPassword, email]
            );
        }

        res.status(200).json({ message: "Password updated successfully in all associated accounts" });
    } catch (err) {
        console.error("Update Error Details:", err);
        res.status(500).json({ message: "Failed to update password", error: err.message });
    }
});

module.exports = router;