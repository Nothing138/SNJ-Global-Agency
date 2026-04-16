const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // ১. Counts 
        const [users] = await db.execute("SELECT COUNT(*) as total FROM users");
        const [jobs] = await db.execute("SELECT COUNT(*) as total FROM jobs");
        const [apps] = await db.execute("SELECT COUNT(*) as total FROM job_applications");

        // ২. Application Flow (Chart Data)
        const [chartData] = await db.execute(`
            SELECT DATE_FORMAT(application_date, '%b %d') as date, COUNT(*) as count 
            FROM job_applications 
            GROUP BY date ORDER BY application_date ASC LIMIT 7
        `);

        // ৩. Job Status (Bar Chart)
        const [jobStatus] = await db.execute(`
            SELECT status as name, COUNT(*) as value FROM jobs GROUP BY status
        `);

        // ৪. Recent Bookings (Error Fix: JOIN use kora hoyeche)
        // b.client_name nai, tai u.full_name ke client_name alias dewa hoyeche
        const [recentBookings] = await db.execute(`
            SELECT 
                b.id, 
                u.full_name as client_name, 
                p.title as package, 
                b.status 
            FROM tour_bookings b 
            JOIN users u ON b.user_id = u.id 
            JOIN tour_packages p ON b.package_id = p.id 
            ORDER BY b.id DESC LIMIT 5
        `);

        res.json({
            success: true,
            stats: {
                totalUsers: users[0].total,
                totalJobs: jobs[0].total,
                totalApps: apps[0].total,
            },
            chartData: chartData.length > 0 ? chartData : [{date: 'No Data', count: 0}],
            jobStatus,
            recentBookings
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};