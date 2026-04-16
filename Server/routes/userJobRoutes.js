const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
  destination: 'uploads/applications/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- Get All Jobs with Filtering, Sorting & Pagination ---
router.get('/all', async (req, res) => {
    try {
        let { page = 1, limit = 6, type, sort, search } = req.query;
        let offset = (page - 1) * limit;

        let query = `SELECT * FROM jobs WHERE status = 'active'`;
        let countQuery = `SELECT COUNT(*) as total FROM jobs WHERE status = 'active'`;
        let queryParams = [];

        // 🔍 Search Logic
        if (search) {
            const searchVal = `%${search}%`;
            query += ` AND (job_title LIKE ? OR company_name LIKE ?)`;
            countQuery += ` AND (job_title LIKE ? OR company_name LIKE ?)`;
            queryParams.push(searchVal, searchVal);
        }

        // 🎯 Filter by Job Type (on-site, remote, hybrid)
        if (type && type !== 'All') {
            query += ` AND job_type = ?`;
            countQuery += ` AND job_type = ?`;
            queryParams.push(type.toLowerCase());
        }

        // 💰 Sorting by Salary (Assuming salary_range has numeric values or logic)
        if (sort === 'high') {
            query += ` ORDER BY CAST(salary_range AS UNSIGNED) DESC`;
        } else if (sort === 'low') {
            query += ` ORDER BY CAST(salary_range AS UNSIGNED) ASC`;
        } else {
            query += ` ORDER BY created_at DESC`;
        }

        // 📄 Pagination
        query += ` LIMIT ? OFFSET ?`;
        let finalParams = [...queryParams, parseInt(limit), parseInt(offset)];

        const [jobs] = await db.query(query, finalParams);
        const [totalCount] = await db.query(countQuery, queryParams);

        res.json({
            jobs,
            totalPages: Math.ceil(totalCount[0].total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- POST: Apply for a Job ---
router.post('/apply', upload.fields([{ name: 'cv' }, { name: 'photo' }]), async (req, res) => {
  try {
    const { job_id, candidate_id, full_name, address, nationality, current_location, qualification, skills, demand } = req.body;
    
    const cv_url = req.files['cv'] ? `/uploads/applications/${req.files['cv'][0].filename}` : null;
    const photo_url = req.files['photo'] ? `/uploads/applications/${req.files['photo'][0].filename}` : null;

    const query = `INSERT INTO job_applications 
      (job_id, candidate_id, full_name, address, nationality, current_location, qualification, skills, demand, cv_url, photo_url, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'applied')`;

    await db.query(query, [job_id, candidate_id, full_name, address, nationality, current_location, qualification, skills, demand, cv_url, photo_url]);

    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;