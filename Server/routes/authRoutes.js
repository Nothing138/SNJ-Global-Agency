const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { auth, authorize } = require('../middleware/authMiddleware');
const { login, register } = require('../controllers/authController');

// --- 1. DASHBOARD SUMMARY (Everyone in Admin Panel) ---
router.get('/dashboard-stats', auth, async (req, res) => {
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

// --- 2. VISA CATEGORIES (HR & SuperAdmin) ---
router.get('/visa-categories', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visa_categories ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/visa-categories', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
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

router.delete('/visa-categories/:id', auth, authorize(['superadmin']), async (req, res) => {
    try {
        await db.query("DELETE FROM visa_categories WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Category deleted!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 3. COUNTRY LIST (HR & SuperAdmin) ---
router.get('/visa-countries', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
    try {
        const query = `
            SELECT vc.*, cat.category_name 
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

router.post('/visa-countries', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
    const { country_name, category_id, application_charge } = req.body;
    try {
        const sql = "INSERT INTO visa_countries (country_name, category_id, application_charge, status) VALUES (?, ?, ?, 'active')";
        await db.query(sql, [country_name, category_id, application_charge]);
        res.json({ success: true, message: "Country added successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 4. VISA APPLICATIONS (HR & SuperAdmin) ---
router.get('/visa-applications', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
    try {
        const query = `
            SELECT va.*, u.full_name, vc.category_name as visa_type_name 
            FROM visa_applications va
            JOIN users u ON va.user_id = u.id
            LEFT JOIN visa_categories vc ON va.category_id = vc.id
            ORDER BY va.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. AGENCY BLOG (Editor, Moderator, HR, SuperAdmin) ---
router.post('/blogs', auth, authorize(['editor', 'moderator', 'hr_manager', 'superadmin']), async (req, res) => {
    const { title, content, featured_image } = req.body;
    const author_id = req.user.id; // Token theke auto author_id nibe
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    try {
        await db.query(
            "INSERT INTO blogs (author_id, title, slug, content, featured_image, status) VALUES (?, ?, ?, ?, ?, 'published')",
            [author_id, title, slug, content, featured_image]
        );
        res.json({ success: true, message: "Blog posted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Blog delete shudhu moderator ba superadmin parbe
router.delete('/blogs/:id', auth, authorize(['moderator', 'superadmin']), async (req, res) => {
    try {
        await db.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Blog deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 6. JOB CIRCULAR (HR & SuperAdmin) ---
router.post('/jobs', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
    const { title, company_name, location, salary, job_type, description, recruiter_id } = req.body;
    try {
        await db.query(
            "INSERT INTO jobs (title, company_name, location, salary, job_type, description, recruiter_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')",
            [title, company_name, location, salary, job_type, description, recruiter_id || 1]
        );
        res.json({ success: true, message: "Job Posted Successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 7. RECRUITER MANAGEMENT (HR & SuperAdmin) ---
router.get('/recruiters/manage', auth, authorize(['hr_manager', 'superadmin']), async (req, res) => {
    try {
        const query = `
            SELECT r.*, 
            COUNT(DISTINCT j.id) as total_jobs,
            COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count
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

// Recruiter Approve/Status update (SuperAdmin only)
router.patch('/recruiters/:id/status', auth, authorize(['superadmin']), async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE recruiters SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Recruiter status updated to ${status}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 8. ANALYTICS & STATS (SuperAdmin Only) ---
router.get('/stats', auth, authorize(['superadmin']), async (req, res) => {
    try {
        const [revenue] = await db.query("SELECT SUM(p.price) as total FROM tour_bookings b JOIN tour_packages p ON b.package_id = p.id");
        const [staff] = await db.query("SELECT COUNT(*) as total FROM users WHERE role != 'candidate'");
        const [bookings] = await db.query("SELECT COUNT(*) as total FROM tour_bookings");

        res.json({
            revenue: revenue[0].total || 0,
            staff: staff[0].total,
            bookings: bookings[0].total
        });
    } catch (err) {
        res.status(500).json({ error: "Database synchronization failed." });
    }
});

// --- 9. COMMUNICATIONS (Editor & HR & SuperAdmin) ---
router.get('/notifications/latest', auth, authorize(['editor', 'hr_manager', 'superadmin']), async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM notifications ORDER BY id DESC LIMIT 10");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/notifications', auth, authorize(['editor', 'hr_manager', 'superadmin']), async (req, res) => {
    const { title, message, type } = req.body;
    try {
        await db.query("INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)", [title, message, type]);
        res.json({ success: true, message: "Broadcast is now live!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/notifications/:id', auth, authorize(['superadmin', 'moderator']), async (req, res) => {
    try {
        await db.query("DELETE FROM notifications WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Notification purged." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;