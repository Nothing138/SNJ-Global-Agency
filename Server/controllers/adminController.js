const db = require('../config/db');

// Pending Recruiter-der list dekha
exports.getPendingRecruiters = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, full_name, email, status FROM users WHERE role = 'recruiter' AND status = 'pending'"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Recruiter Approve kora (Auto-entry logic added)
exports.approveRecruiter = async (req, res) => {
    const { id } = req.params; // Eita holo users table-er ID
    
    try {
        // 1. Prothome user-er status 'approved' kora
        await db.execute("UPDATE users SET status = 'approved' WHERE id = ?", [id]);

        // 2. User-er information fetch kora (recruiters table-e bhorar jonno)
        const [userRows] = await db.execute("SELECT full_name FROM users WHERE id = ?", [id]);
        const userName = userRows[0].full_name;

        // 3. Recruiters table-e automatic entry deua (jodi age na thake)
        // SQL: user_id, company_name, recruiter_status
        const [existing] = await db.execute("SELECT id FROM recruiters WHERE user_id = ?", [id]);
        
        if (existing.length === 0) {
            await db.execute(
                "INSERT INTO recruiters (user_id, company_name, recruiter_status) VALUES (?, ?, 'approved')",
                [id, userName]
            );
            console.log(`Recruiter profile created for ${userName}`);
        }

        res.json({ 
            success: true, 
            message: "Recruiter approved and profile created successfully!" 
        });

    } catch (err) {
        console.error("Approval Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};