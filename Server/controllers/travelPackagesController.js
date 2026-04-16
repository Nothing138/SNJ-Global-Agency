
const db = require('../config/db');

/*const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([rows]) => rows);
    }
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};*/
const query = (sql, params = []) => {
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([rows]) => rows);
    }
    if (typeof db.execute === 'function' || typeof db.query === 'function') {
        return db.query(sql, params).then(([rows]) => rows);
    }
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};


const ALLOWED_SORT = ['country', 'country_code', 'b2b_price', 'b2c_price', 'travel_time', 'status'];

// GET /api/b2b/travel
exports.getTravel = async (req, res) => {
    try {
        const page      = Math.max(1, parseInt(req.query.page)  || 1);
        const limit     = Math.max(1, parseInt(req.query.limit) || 15);
        const offset    = (page - 1) * limit;
        const search    = (req.query.search || '').trim();
        const status    = req.query.status || '';
        const sortBy    = ALLOWED_SORT.includes(req.query.sortBy) ? req.query.sortBy : 'country';
        const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

        const conditions = [];
        const params = [];

        if (search) {
            conditions.push('(country LIKE ? OR country_code LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status && ['active', 'inactive', 'hidden'].includes(status)) {
            conditions.push('status = ?');
            params.push(status);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const countRows = await query(`SELECT COUNT(*) AS total FROM travel_packages ${where}`, params);
        const total = countRows[0]?.total || 0;

        const rows = await query(
            `SELECT * FROM travel_packages ${where} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return res.json({
            success: true,
            data: rows,
            pagination: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// GET /api/b2b/travel/:id
exports.getTravelById = async (req, res) => {
    try {
        const rows = await query('SELECT * FROM travel_packages WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, data: rows[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// POST /api/b2b/travel
exports.createTravel = async (req, res) => {
    try {
        const { country, country_code, b2b_price, b2c_price, travel_time, status } = req.body;

        if (!country?.toString().trim())
            return res.status(400).json({ success: false, message: 'country is required' });

        const code = country_code?.toString().trim().toUpperCase();
        if (!code || !/^[A-Z]{2}$/.test(code))
            return res.status(400).json({ success: false, message: 'country_code must be exactly 2 letters' });

        const b2b = parseFloat(b2b_price);
        const b2c = parseFloat(b2c_price);
        if (isNaN(b2b) || b2b <= 0) return res.status(400).json({ success: false, message: 'Invalid b2b_price' });
        if (isNaN(b2c) || b2c <= 0) return res.status(400).json({ success: false, message: 'Invalid b2c_price' });
        if (!travel_time?.toString().trim()) return res.status(400).json({ success: false, message: 'travel_time is required' });

        const finalStatus = ['active', 'inactive', 'hidden'].includes(status) ? status : 'active';

        const existing = await query('SELECT id FROM travel_packages WHERE country_code = ?', [code]);
        if (existing.length) return res.status(409).json({ success: false, message: `Country code "${code}" already exists` });

        const result = await query(
            `INSERT INTO travel_packages (country, country_code, b2b_price, b2c_price, travel_time, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [country.toString().trim(), code, b2b, b2c, travel_time.toString().trim(), finalStatus]
        );

        const newRow = await query('SELECT * FROM travel_packages WHERE id = ?', [result.insertId]);
        return res.status(201).json({ success: true, message: 'Travel package created successfully', data: newRow[0] });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Country code already exists' });
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// PUT /api/b2b/travel/:id
exports.updateTravel = async (req, res) => {
    try {
        const { b2b_price, b2c_price, travel_time, status } = req.body;
        const b2b = parseFloat(b2b_price);
        const b2c = parseFloat(b2c_price);
        if (isNaN(b2b) || b2b <= 0 || isNaN(b2c) || b2c <= 0)
            return res.status(400).json({ success: false, message: 'Invalid price values' });

        const result = await query(
            `UPDATE travel_packages SET b2b_price = ?, b2c_price = ?, travel_time = ?, status = ? WHERE id = ?`,
            [b2b, b2c, travel_time || null, status || 'active', req.params.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// PATCH /api/b2b/travel/:id/status
exports.updateTravelStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'inactive', 'hidden'].includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status. Must be: active | inactive | hidden' });

        const result = await query('UPDATE travel_packages SET status = ? WHERE id = ?', [status, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, message: 'Status updated successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// DELETE /api/b2b/travel/:id
exports.deleteTravel = async (req, res) => {
    try {
        const result = await query('DELETE FROM travel_packages WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};