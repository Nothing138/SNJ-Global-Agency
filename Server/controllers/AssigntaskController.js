const db = require('../config/db');

// ─── Promise-based query helper ───────────────────────────────────────────────
const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([rows]) => rows);
    }
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// ─── 1. GET: Active B2B Partners (dropdown) ───────────────────────────────────
exports.getActivePartners = async (req, res) => {
    try {
        const rows = await query(`
            SELECT id, company_name, purpose, country
            FROM b2b_partners
            WHERE status = 'approved' AND is_verified = 1
            ORDER BY company_name ASC
        `);
        res.json(rows);
    } catch (err) {
        console.error('getActivePartners:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching partners' });
    }
};

// ─── 2. GET: Countries by service type (dropdown) ─────────────────────────────
exports.getServiceCountries = async (req, res) => {
    const { service_type } = req.query;
    if (!service_type) {
        return res.status(400).json({ success: false, message: 'service_type is required' });
    }

    try {
        let rows = [];

        if (service_type === 'Visa Referral') {
            rows = await query(`
                SELECT id, country, country_code,
                       b2b_price, b2c_price,
                       processing_time, visa_type, working_type,
                       NULL AS service_source
                FROM b2b_pricing
                WHERE status = 'active'
                ORDER BY country ASC
            `);
        } else if (service_type === 'Travel Packages') {
            rows = await query(`
                SELECT id, country, country_code,
                       b2b_price, b2c_price,
                       travel_time AS processing_time,
                       NULL AS visa_type, NULL AS working_type,
                       NULL AS service_source
                FROM travel_packages
                WHERE status = 'active'
                ORDER BY country ASC
            `);
        } else if (service_type === 'Citizenship Programs') {
            rows = await query(`
                SELECT id, country, country_code,
                       b2b_price, b2c_price,
                       processing_time,
                       NULL AS visa_type, NULL AS working_type,
                       NULL AS service_source
                FROM citizenship_programs
                WHERE status = 'active'
                ORDER BY country ASC
            `);
        } else if (service_type === 'Multiple Services') {
            const [visa, travel, citizen] = await Promise.all([
                query(`SELECT id, country, country_code, b2b_price, b2c_price,
                              processing_time, visa_type, working_type,
                              'Visa Referral' AS service_source
                       FROM b2b_pricing WHERE status = 'active'`),
                query(`SELECT id, country, country_code, b2b_price, b2c_price,
                              travel_time AS processing_time,
                              NULL AS visa_type, NULL AS working_type,
                              'Travel Packages' AS service_source
                       FROM travel_packages WHERE status = 'active'`),
                query(`SELECT id, country, country_code, b2b_price, b2c_price,
                              processing_time,
                              NULL AS visa_type, NULL AS working_type,
                              'Citizenship Programs' AS service_source
                       FROM citizenship_programs WHERE status = 'active'`),
            ]);
            rows = [...visa, ...travel, ...citizen];
        } else {
            return res.status(400).json({ success: false, message: 'Invalid service_type' });
        }

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('getServiceCountries:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching countries', error: err.message });
    }
};

// ─── 3. POST: Create / Assign new task ───────────────────────────────────────
exports.assignTask = async (req, res) => {
    console.log('📥 assignTask body:', req.body);

    const {
        user_name, address, passport_number, contact_number,
        id_number, nationality, passport_validity_month,
        email, service_type, partner_id,
        destination_country, destination_country_code,
        selected_price, price_type
    } = req.body;

    // Validation
    const missing = [];
    if (!user_name)       missing.push('user_name');
    if (!passport_number) missing.push('passport_number');
    if (!contact_number)  missing.push('contact_number');
    if (!email)           missing.push('email');
    if (!service_type)    missing.push('service_type');
    if (!partner_id)      missing.push('partner_id');

    if (missing.length) {
        return res.status(400).json({
            success: false,
            message: `Missing: ${missing.join(', ')}`
        });
    }

    const parsedPartnerId = parseInt(partner_id);
    if (isNaN(parsedPartnerId)) {
        return res.status(400).json({ success: false, message: 'Invalid partner_id' });
    }

    try {
        const result = await query(
            `INSERT INTO assigned_tasks
             (user_name, address, passport_number, contact_number,
              id_number, nationality, passport_validity_month,
              email, service_type, partner_id,
              destination_country, destination_country_code,
              selected_price, price_type, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                user_name,
                address        || null,
                passport_number,
                contact_number,
                id_number      || null,
                nationality    || null,
                passport_validity_month ? parseInt(passport_validity_month) : null,
                email,
                service_type,
                parsedPartnerId,
                destination_country      || null,
                destination_country_code || null,
                selected_price           ? parseFloat(selected_price) : null,
                price_type               || 'b2b_price',
            ]
        );

        console.log('✅ Inserted task ID:', result.insertId);
        res.status(201).json({
            success: true,
            message: 'Task assigned successfully!',
            task_id: result.insertId
        });
    } catch (err) {
        console.error('❌ assignTask DB error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to assign task',
            error: err.message
        });
    }
};

// ─── 4. GET: All assigned tasks (table list) ──────────────────────────────────
exports.getAssignedTasks = async (req, res) => {
    try {
        const rows = await query(`
            SELECT
                t.*,
                p.company_name,
                p.country AS partner_country
            FROM assigned_tasks t
            JOIN b2b_partners p ON t.partner_id = p.id
            ORDER BY t.assigned_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('getAssignedTasks:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching tasks' });
    }
};

// ─── 5. GET: Single task by id ────────────────────────────────────────────────
exports.getTaskById = async (req, res) => {
    try {
        const rows = await query(`
            SELECT t.*, p.company_name, p.country AS partner_country
            FROM assigned_tasks t
            JOIN b2b_partners p ON t.partner_id = p.id
            WHERE t.id = ?
        `, [parseInt(req.params.id)]);

        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('getTaskById:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching task' });
    }
};

// ─── 6. PUT: Update full task (edit) ─────────────────────────────────────────
exports.updateTask = async (req, res) => {
    const {
        user_name, address, passport_number, contact_number,
        id_number, nationality, passport_validity_month,
        email, service_type, partner_id,
        destination_country, destination_country_code,
        selected_price, price_type
    } = req.body;

    const missing = [];
    if (!user_name)       missing.push('user_name');
    if (!passport_number) missing.push('passport_number');
    if (!contact_number)  missing.push('contact_number');
    if (!email)           missing.push('email');
    if (!service_type)    missing.push('service_type');
    if (!partner_id)      missing.push('partner_id');

    if (missing.length) {
        return res.status(400).json({ success: false, message: `Missing: ${missing.join(', ')}` });
    }

    try {
        const result = await query(
            `UPDATE assigned_tasks SET
                user_name = ?, address = ?, passport_number = ?,
                contact_number = ?, id_number = ?, nationality = ?,
                passport_validity_month = ?, email = ?, service_type = ?,
                partner_id = ?, destination_country = ?,
                destination_country_code = ?, selected_price = ?, price_type = ?
             WHERE id = ?`,
            [
                user_name,
                address        || null,
                passport_number,
                contact_number,
                id_number      || null,
                nationality    || null,
                passport_validity_month ? parseInt(passport_validity_month) : null,
                email,
                service_type,
                parseInt(partner_id),
                destination_country      || null,
                destination_country_code || null,
                selected_price           ? parseFloat(selected_price) : null,
                price_type               || 'b2b_price',
                parseInt(req.params.id),
            ]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task updated successfully' });
    } catch (err) {
        console.error('updateTask:', err.message);
        res.status(500).json({ success: false, message: 'Update failed', error: err.message });
    }
};

// ─── 7. PATCH: Update status only ────────────────────────────────────────────
exports.updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const valid = ['pending', 'processing', 'confirmed', 'completed', 'rejected'];

    if (!valid.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    try {
        const result = await query(
            'UPDATE assigned_tasks SET status = ? WHERE id = ?',
            [status, parseInt(req.params.id)]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        console.error('updateTaskStatus:', err.message);
        res.status(500).json({ success: false, message: 'Update failed', error: err.message });
    }
};

// ─── 8. DELETE: Remove task ───────────────────────────────────────────────────
exports.deleteTask = async (req, res) => {
    try {
        const result = await query(
            'DELETE FROM assigned_tasks WHERE id = ?',
            [parseInt(req.params.id)]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        console.error('deleteTask:', err.message);
        res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
    }
};