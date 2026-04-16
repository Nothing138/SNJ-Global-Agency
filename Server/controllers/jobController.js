const db = require('../config/db');

// --- 1. Job Post Kora ---
exports.postJob = async (req, res) => {
    try {
        const { 
            job_title, 
            company_name, 
            job_description, 
            country, 
            salary_range, 
            job_type, 
            category, 
            end_date 
        } = req.body;
        
        // req.user theke ID nibe, na pele default 1
        const posted_by = (req.user && req.user.id) ? req.user.id : 1; 

        // Notun job post korle status default 'active' thakbe
        const sql = `
            INSERT INTO jobs 
            (posted_by, job_title, company_name, job_description, country, salary_range, job_type, category, end_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `;

        await db.execute(sql, [
            posted_by, 
            job_title, 
            company_name, 
            job_description, 
            country, 
            salary_range, 
            job_type, 
            category || 'General', 
            end_date
        ]);

        res.status(201).json({ 
            success: true, 
            message: "BOMB! Job posted successfully!" 
        });

    } catch (err) {
        console.error("Job Post Error:", err);
        res.status(500).json({ success: false, error: "Database issue", details: err.message });
    }
};

// --- 2. Admin/Recruiter er jonno shob job (CRUD er jonno) ---
exports.getAllJobsAdmin = async (req, res) => {
    try {
        const sql = `SELECT * FROM jobs ORDER BY created_at DESC`;
        const [jobs] = await db.execute(sql);
        res.json({ success: true, jobs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- 3. User Side Job List (Shudhu Active ar Date thakle dekhabe) ---
exports.getAllJobs = async (req, res) => {
    try {
        // Logic: Status 'active' hote hobe AND end_date ajker cheye boro hote hobe
        const sql = `
            SELECT jobs.*, users.full_name as posted_by_name 
            FROM jobs 
            LEFT JOIN users ON jobs.posted_by = users.id 
            WHERE jobs.status = 'active' AND (jobs.end_date >= CURDATE() OR jobs.end_date IS NULL)
            ORDER BY jobs.created_at DESC
        `;
        const [jobs] = await db.execute(sql);
        res.json({ success: true, jobs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- 4. Job Update Logic (Edit Modal ar Status Toggle er jonno) ---
exports.updateJob = async (req, res) => {
    const { id } = req.params;
    const { 
        job_title, 
        company_name, 
        job_description, 
        country, 
        salary_range, 
        job_type, 
        category, 
        end_date,
        status 
    } = req.body;

    try {
        const sql = `
            UPDATE jobs SET 
            job_title = ?, company_name = ?, job_description = ?, 
            country = ?, salary_range = ?, job_type = ?, 
            category = ?, end_date = ?, status = ?
            WHERE id = ?
        `;

        await db.execute(sql, [
            job_title, company_name, job_description, 
            country, salary_range, job_type, 
            category, end_date, status, id
        ]);

        res.json({ success: true, message: "Job updated successfully!" });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- 5. Job Delete Logic ---
exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("DELETE FROM jobs WHERE id = ?", [id]);
        res.json({ success: true, message: "Job deleted from database!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};