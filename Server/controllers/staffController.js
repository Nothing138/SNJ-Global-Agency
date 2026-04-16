exports.getAllMembers = async (req, res) => {
    try {
        // Eikhane shobgula role add kora hoyeche jate shobai list-e ashe
        const [rows] = await db.execute(
            "SELECT id, full_name, email, role, status FROM users WHERE role IN ('editor', 'hr_manager', 'moderator', 'recruiter') ORDER BY id DESC"
        );
        
        console.log("Database theke asha data:", rows); // Terminal-e check korben data ashche kina
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};