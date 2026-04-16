const db = require('../config/db');

// Recruiter profile create logic
const createRecruiter = async (req, res) => {
    try {
        const { user_id, company_name, phone_number, company_website, company_bio, total_staff_count } = req.body;
        
        const company_logo = req.files && req.files['logo'] ? req.files['logo'][0].path : null;
        const verification_docs = req.files && req.files['docs'] ? req.files['docs'][0].path : null;

        const sql = `INSERT INTO recruiters 
        (user_id, company_name, phone_number, company_website, company_bio, company_logo, verification_docs, recruiter_status, total_staff_count) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`;

        db.query(sql, [user_id, company_name, phone_number, company_website, company_bio, company_logo, verification_docs, total_staff_count], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                success: true, 
                message: "Profile submitted for approval!" 
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fetch Profile
const getProfile = (req, res) => {
    const { userId } = req.params;
    db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results[0]);
    });
};

// Update Profile
const updateRecruiter = (req, res) => {
    const { user_id, company_name, phone_number, company_website, company_bio, total_staff_count } = req.body;
    let sql = `UPDATE recruiters SET company_name=?, phone_number=?, company_website=?, company_bio=?, total_staff_count=?, recruiter_status='approved'`;
    let params = [company_name, phone_number, company_website, company_bio, total_staff_count];

    if (req.files && req.files['logo']) {
        sql += `, company_logo=?`;
        params.push(req.files['logo'][0].path);
    }

    sql += ` WHERE user_id=?`;
    params.push(user_id);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        // Success: true pathatei hobe jate frontend bujhte pare kaj hoise
        return res.status(200).json({ 
            success: true, 
            message: "Profile Updated Successfully!" 
        });
    });
};
module.exports = { createRecruiter, getProfile, updateRecruiter };