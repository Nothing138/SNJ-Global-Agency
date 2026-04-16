const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = file.fieldname === 'photo' ? 'public/uploads/user_photo' : 'public/uploads/passport_photo';
        createFolder(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const userName = req.body.first_name ? req.body.first_name.replace(/\s+/g, '_') : 'user';
        cb(null, `${userName}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// 1. Get all Visa Categories with Count
router.get('/categories', async (req, res) => {
    const sql = `
        SELECT vc.id, vc.category_name as title, COUNT(vco.id) as count 
        FROM visa_categories vc
        LEFT JOIN visa_countries vco ON vc.id = vco.category_id
        GROUP BY vc.id`;
    
    try {
        const [results] = await db.query(sql); 
        res.json(results);
    } catch (err) {
        console.error("Category Error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
});

// 2. Get all Visa Countries (Listing/Cards)
router.get('/', async (req, res) => {
    const sql = `
        SELECT vco.*, vc.category_name as type 
        FROM visa_countries vco
        LEFT JOIN visa_categories vc ON vco.category_id = vc.id
        WHERE vco.status = 'active'`;
    
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error("Visa Error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
});

// 🚀 3. Get Single Visa Details (NEW & PREMIUM)
// Eita apnar VisaDetails.jsx page-er data supply korbe
router.get('/:id', async (req, res) => {
    const visaId = req.params.id;
    const sql = `
        SELECT vco.*, vc.category_name as type 
        FROM visa_countries vco
        LEFT JOIN visa_categories vc ON vco.category_id = vc.id
        WHERE vco.id = ? AND vco.status = 'active'`;
    
    try {
        const [results] = await db.query(sql, [visaId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Visa route not found" });
        }
        
        // Response pathanor somoy single object pathachchi
        res.json(results[0]);
    } catch (err) {
        console.error("Details Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch visa details" });
    }
});

// 4. Post Visa Application
router.post('/apply', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'passport_file', maxCount: 1 }]), async (req, res) => {
    const { 
        user_id, visa_id, first_name, surname, nationality, country, gender, 
        dob, id_number, passport, passport_expiry, location, profession, phone 
    } = req.body;

    if (!user_id || user_id === 'undefined' || user_id === 'null') {
        return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const photo_url = req.files['photo'] ? `/uploads/user_photo/${req.files['photo'][0].filename}` : null;
    const passport_doc = req.files['passport_file'] ? `/uploads/passport_photo/${req.files['passport_file'][0].filename}` : null;

    try {
        // Step 1: User Profile Update or Insert
        const [existing] = await db.query("SELECT id FROM user_details WHERE user_id = ?", [user_id]);

        if (existing.length > 0) {
            await db.query(`UPDATE user_details SET first_name=?, surname=?, nationality=?, country=?, gender=?, date_of_birth=?, id_number=?, passport_number=?, passport_expiry=?, current_location=?, profession=?, phone_number=?, photo_url=IFNULL(?, photo_url), passport_doc=IFNULL(?, passport_doc) WHERE user_id=?`,
            [first_name, surname, nationality, country, gender, dob || null, id_number, passport, passport_expiry || null, location, profession, phone, photo_url, passport_doc, user_id]);
        } else {
            await db.query(`INSERT INTO user_details (user_id, first_name, surname, nationality, country, gender, date_of_birth, id_number, passport_number, passport_expiry, current_location, profession, phone_number, photo_url, passport_doc) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [user_id, first_name, surname, nationality, country, gender, dob || null, id_number, passport, passport_expiry || null, location, profession, phone, photo_url, passport_doc]);
        }

        // Step 2: Visa Application Logic
        const [visaData] = await db.query("SELECT category_id, country_name FROM visa_countries WHERE id = ?", [visa_id]);
        
        if (visaData.length === 0) {
            return res.status(404).json({ success: false, message: "Visa ID not found in database" });
        }

        const category_id = visaData[0].category_id;
        const destination_country = visaData[0].country_name;

        const applySql = `INSERT INTO visa_applications 
            (user_id, category_id, country_id, destination_country, visa_type, application_status, payment_status) 
            VALUES (?, ?, ?, ?, 'work', 'submitted', 'unpaid')`;
        
        await db.query(applySql, [user_id, category_id, visa_id, destination_country]);

        res.json({ success: true, message: "Application submitted successfully!" });

    } catch (err) {
        console.error("SQL Error Detailed:", err);
        res.status(500).json({ success: false, error: "Database error", details: err.sqlMessage });
    }
});

module.exports = router;