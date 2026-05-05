// controllers/AssigntaskController.js
const db = require('../config/db');

// ─── Helper: promise query ────────────────────────────────────────────────────
const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([result]) => result);
    }
    if (typeof db.execute === 'function') {
        return db.execute(sql, params).then(([result]) => result);
    }
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ─── 1. Active B2B Partners (dropdown এর জন্য) ───────────────────────────────
exports.getActivePartners = async (req, res) => {
    try {
        const rows = await query(
            `SELECT id, company_name, purpose, country 
             FROM b2b_partners 
             WHERE status = 'approved' AND is_verified = 1
             ORDER BY company_name ASC`
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('getActivePartners error:', err);
        res.status(500).json({ message: "Error fetching partners" });
    }
};

// ─── 2. Service Type অনুযায়ী Country+Price লোড করা ──────────────────────────
// GET /api/admin/service-countries?service_type=Visa Referral
exports.getServiceCountries = async (req, res) => {
    const { service_type } = req.query;

    try {
        let rows = [];

        if (service_type === 'Visa Referral') {
            rows = await query(
                `SELECT id, country, country_code, b2b_price, b2c_price, 
                        processing_time, visa_type, working_type
                 FROM b2b_pricing 
                 WHERE status = 'active'
                 ORDER BY country ASC`
            );
        } else if (service_type === 'Travel Packages') {
            rows = await query(
                `SELECT id, country, country_code, b2b_price, b2c_price, 
                        travel_time AS processing_time, NULL AS visa_type, NULL AS working_type
                 FROM travel_packages 
                 WHERE status = 'active'
                 ORDER BY country ASC`
            );
        } else if (service_type === 'Citizenship Programs') {
            rows = await query(
                `SELECT id, country, country_code, b2b_price, b2c_price, 
                        processing_time, NULL AS visa_type, NULL AS working_type
                 FROM citizenship_programs 
                 WHERE status = 'active'
                 ORDER BY country ASC`
            );
        } else if (service_type === 'Multiple Services') {
            // সব ৩ টেবিল থেকে আনো, source বোঝার জন্য service_source column যোগ করা হয়েছে
            const visa = await query(
                `SELECT id, country, country_code, b2b_price, b2c_price, 
                        processing_time, 'Visa Referral' AS service_source
                 FROM b2b_pricing WHERE status = 'active'`
            );
            const travel = await query(
                `SELECT id, country, country_code, b2b_price, b2c_price, 
                        travel_time AS processing_time, 'Travel Packages' AS service_source
                 FROM travel_packages WHERE status = 'active'`
            );
            const citizen = await query(
                `SELECT id, country, country_code, b2b_price, b2c_price, 
                        processing_time, 'Citizenship Programs' AS service_source
                 FROM citizenship_programs WHERE status = 'active'`
            );
            rows = [...visa, ...travel, ...citizen];
        } else {
            return res.status(400).json({ message: 'Invalid service_type' });
        }

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('getServiceCountries error:', err);
        res.status(500).json({ message: "Error fetching countries", error: err.message });
    }
};

// ─── 3. নতুন Task Assign করা ─────────────────────────────────────────────────
exports.assignTask = async (req, res) => {
    const {
        user_name, address, passport_number, contact_number,
        id_number, nationality, passport_validity_month,
        email, service_type, partner_id,
        destination_country, destination_country_code,
        selected_price, price_type
    } = req.body;

    // Validation
    if (!user_name || !passport_number || !contact_number || !email || !service_type || !partner_id || !destination_country) {
        return res.status(400).json({
            success: false,
            message: 'Required: user_name, passport_number, contact_number, email, service_type, partner_id, destination_country'
        });
    }

    try {
        const result = await query(
            `INSERT INTO assigned_tasks 
             (user_name, address, passport_number, contact_number, id_number, nationality, 
              passport_validity_month, email, service_type, partner_id,
              destination_country, destination_country_code, selected_price, price_type, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                user_name, address || null, passport_number, contact_number,
                id_number || null, nationality || null,
                passport_validity_month ? parseInt(passport_validity_month) : null,
                email, service_type, parseInt(partner_id),
                destination_country, destination_country_code || null,
                selected_price ? parseFloat(selected_price) : null,
                price_type || 'b2b_price'
            ]
        );

        res.status(201).json({
            success: true,
            message: "Task assigned successfully!",
            task_id: result.insertId
        });
    } catch (err) {
        console.error('assignTask error:', err);
        res.status(500).json({ success: false, message: "Failed to assign task", error: err.message });
    }
};

// ─── 4. সব Assigned Tasks এর লিস্ট ──────────────────────────────────────────
exports.getAssignedTasks = async (req, res) => {
    try {
        const rows = await query(
            `SELECT t.*, p.company_name, p.country AS partner_country
             FROM assigned_tasks t
             JOIN b2b_partners p ON t.partner_id = p.id
             ORDER BY t.assigned_at DESC`
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('getAssignedTasks error:', err);
        res.status(500).json({ message: "Error fetching assigned tasks" });
    }
};

// ─── 5. Task Delete ───────────────────────────────────────────────────────────
exports.deleteTask = async (req, res) => {
    try {
        const result = await query(
            "DELETE FROM assigned_tasks WHERE id = ?",
            [parseInt(req.params.id)]
        );
        if (!result.affectedRows) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

// ─── 6. Status Update ─────────────────────────────────────────────────────────
exports.updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'confirmed', 'completed', 'rejected'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const result = await query(
            "UPDATE assigned_tasks SET status = ? WHERE id = ?",
            [status, parseInt(req.params.id)]
        );
        if (!result.affectedRows) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ success: true, message: "Status updated" });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};