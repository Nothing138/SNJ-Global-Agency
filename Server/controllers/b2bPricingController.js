// b2bPricingController.js
const db = require('../config/db');

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

// ─────────────────────────────────────────────────────────────
//  GET  /api/b2b/pricing
// ─────────────────────────────────────────────────────────────
exports.getPricing = async (req, res) => {
    try {
        const page      = Math.max(1, parseInt(req.query.page)  || 1);
        const limit     = Math.max(1, parseInt(req.query.limit) || 15);
        const offset    = (page - 1) * limit;
        const search    = (req.query.search || '').trim();
        const status    = req.query.status || '';

        const ALLOWED_SORT = ['country', 'country_code', 'b2b_price', 'b2c_price',
                              'processing_time', 'working_type', 'visa_type', 'status'];
        const sortBy    = ALLOWED_SORT.includes(req.query.sortBy) ? req.query.sortBy : 'country';
        const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

        const conditions = [];
        const params     = [];

        if (search) {
            conditions.push('(country LIKE ? OR country_code LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status && ['active', 'inactive', 'pending'].includes(status)) {
            conditions.push('status = ?');
            params.push(status);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const countRows = await query(
            `SELECT COUNT(*) AS total FROM b2b_pricing ${where}`,
            params
        );
        const total = countRows[0]?.total || 0;

        const rows = await query(
            `SELECT * FROM b2b_pricing ${where} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return res.json({
            success: true,
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        });
    } catch (err) {
        console.error('[getPricing] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  GET  /api/b2b/pricing/:id
// ─────────────────────────────────────────────────────────────
exports.getPricingById = async (req, res) => {
    try {
        const rows = await query('SELECT * FROM b2b_pricing WHERE id = ?', [req.params.id]);
        if (!rows.length)
            return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('[getPricingById] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  POST  /api/b2b/pricing   ← NEW: create a single record
//  Body: { country, country_code, b2b_price, b2c_price,
//          processing_time, working_type, visa_type, status }
// ─────────────────────────────────────────────────────────────
exports.createPricing = async (req, res) => {
    try {
        const { country, country_code, b2b_price, b2c_price,
                processing_time, working_type, visa_type, status } = req.body;

        // ── Validation ──────────────────────────────────────────
        if (!country?.toString().trim())
            return res.status(400).json({ success: false, message: 'country is required' });

        if (!country_code?.toString().trim())
            return res.status(400).json({ success: false, message: 'country_code is required' });

        const code = country_code.toString().trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(code))
            return res.status(400).json({ success: false, message: 'country_code must be exactly 2 letters (ISO 3166-1 alpha-2)' });

        const b2b = parseFloat(b2b_price);
        const b2c = parseFloat(b2c_price);
        if (isNaN(b2b) || b2b <= 0)
            return res.status(400).json({ success: false, message: 'Invalid b2b_price' });
        if (isNaN(b2c) || b2c <= 0)
            return res.status(400).json({ success: false, message: 'Invalid b2c_price' });
        if (!processing_time?.toString().trim())
            return res.status(400).json({ success: false, message: 'processing_time is required' });

        const finalStatus = ['active', 'inactive', 'pending'].includes(status) ? status : 'pending';

        // ── Duplicate check ─────────────────────────────────────
        const existing = await query(
            'SELECT id FROM b2b_pricing WHERE country_code = ?', [code]
        );
        if (existing.length)
            return res.status(409).json({ success: false, message: `Country code "${code}" already exists` });

        // ── Insert ──────────────────────────────────────────────
        const result = await query(
            `INSERT INTO b2b_pricing
                (country, country_code, b2b_price, b2c_price, processing_time, working_type, visa_type, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                country.toString().trim(),
                code,
                b2b,
                b2c,
                processing_time.toString().trim(),
                working_type?.toString().trim() || null,
                visa_type?.toString().trim()    || null,
                finalStatus,
            ]
        );

        // ── Return the newly inserted row ───────────────────────
        const newRow = await query('SELECT * FROM b2b_pricing WHERE id = ?', [result.insertId]);

        return res.status(201).json({
            success: true,
            message: 'Country pricing created successfully',
            data: newRow[0],
        });

    } catch (err) {
        console.error('[createPricing] Error:', err.message);
        // MySQL duplicate-entry error
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ success: false, message: 'Country code already exists' });
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  PUT  /api/b2b/pricing/:id
// ─────────────────────────────────────────────────────────────
exports.updatePricing = async (req, res) => {
    try {
        const { b2b_price, b2c_price, processing_time, working_type, visa_type, status } = req.body;

        const b2b = parseFloat(b2b_price);
        const b2c = parseFloat(b2c_price);

        if (isNaN(b2b) || b2b <= 0)
            return res.status(400).json({ success: false, message: 'Invalid b2b_price' });
        if (isNaN(b2c) || b2c <= 0)
            return res.status(400).json({ success: false, message: 'Invalid b2c_price' });
        if (!processing_time?.toString().trim())
            return res.status(400).json({ success: false, message: 'processing_time is required' });
        if (status && !['active', 'inactive', 'pending'].includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status value' });

        const result = await query(
            `UPDATE b2b_pricing
             SET b2b_price = ?, b2c_price = ?, processing_time = ?,
                 working_type = ?, visa_type = ?, status = ?
             WHERE id = ?`,
            [b2b, b2c, processing_time.toString().trim(),
             working_type || null, visa_type || null, status || 'pending',
             req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, message: 'Record not found' });

        return res.json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        console.error('[updatePricing] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  PATCH  /api/b2b/pricing/:id/status
// ─────────────────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'inactive', 'pending'].includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status. Must be: active | inactive | pending' });

        const result = await query(
            'UPDATE b2b_pricing SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, message: 'Record not found' });

        return res.json({ success: true, message: 'Status updated successfully' });
    } catch (err) {
        console.error('[updateStatus] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  DELETE  /api/b2b/pricing/:id
// ─────────────────────────────────────────────────────────────
exports.deletePricing = async (req, res) => {
    try {
        const result = await query(
            'DELETE FROM b2b_pricing WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, message: 'Record not found' });

        return res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        console.error('[deletePricing] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  PUT  /api/b2b/pricing/bulk
// ─────────────────────────────────────────────────────────────
exports.bulkUpdate = async (req, res) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0)
            return res.status(400).json({ success: false, message: 'No records provided' });

        let updated = 0;
        for (const r of records) {
            const b2b = parseFloat(r.b2b_price);
            const b2c = parseFloat(r.b2c_price);
            if (isNaN(b2b) || b2b <= 0 || isNaN(b2c) || b2c <= 0) continue;

            await query(
                `UPDATE b2b_pricing
                 SET b2b_price = ?, b2c_price = ?, processing_time = ?,
                     working_type = ?, visa_type = ?, status = ?
                 WHERE id = ?`,
                [b2b, b2c, r.processing_time || null,
                 r.working_type || null, r.visa_type || null,
                 r.status || 'pending', r.id]
            );
            updated++;
        }

        return res.json({ success: true, message: `${updated} record(s) updated` });
    } catch (err) {
        console.error('[bulkUpdate] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
