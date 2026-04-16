// b2bdashboardController.js

const db = require('../config/db');

// ── DB helper ─────────────────────────────────────────────────────────────────
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

// ── Partner tier logic ────────────────────────────────────────────────────────
const getTier = (numFiles = 0) => {
    if (numFiles >= 500) return 'Platinum Partner';
    if (numFiles >= 100) return 'Gold Partner';
    if (numFiles >= 20)  return 'Silver Partner';
    return 'Starter Partner';
};

// ── Format date helper ────────────────────────────────────────────────────────
const formatDate = (date) => {
    if (!date) return '31 Dec 2026';
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ── Format datetime ───────────────────────────────────────────────────────────
const formatDateTime = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET  /api/b2b/dashboard/profile
// ─────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const [partnerRows, statsRows] = await Promise.all([
            query(
                `SELECT id, full_name, company_name, email, phone,
                        purpose, num_files, total_completed, country,
                        is_verified, status, created_at
                 FROM b2b_partners
                 WHERE id = ? AND status = 'approved'`,
                [req.partnerId]
            ),
            query(
                `SELECT
                    COUNT(*)                                                             AS totalFiles,
                    SUM(CASE WHEN status IN ('pending','processing','confirmed')
                             THEN 1 ELSE 0 END)                                         AS activeFiles,
                    SUM(CASE WHEN status = 'completed'  THEN 1 ELSE 0 END)              AS completedFiles,
                    SUM(CASE WHEN status = 'rejected'   THEN 1 ELSE 0 END)              AS rejectedFiles
                 FROM assigned_tasks
                 WHERE partner_id = ?`,
                [req.partnerId]
            ),
        ]);

        if (!partnerRows.length) {
            return res.status(404).json({ success: false, message: 'Partner not found or account not approved' });
        }

        const p     = partnerRows[0];
        const stats = statsRows[0] || {};

        const totalFiles     = parseInt(stats.totalFiles,     10) || 0;
        const activeFiles    = parseInt(stats.activeFiles,    10) || 0;
        const completedFiles = parseInt(stats.completedFiles, 10) || 0;
        const rejectedFiles  = parseInt(stats.rejectedFiles,  10) || 0;

        // Success rate: completed / (completed + rejected) × 100
        const denom       = completedFiles + rejectedFiles;
        const successRate = denom > 0 ? Math.round((completedFiles / denom) * 100) : 0;

        return res.json({
            success: true,
            data: {
                id:           p.id,
                name:         p.full_name,
                contact:      p.phone,
                email:        p.email,
                company:      p.company_name,
                country:      p.country      || '—',
                address:      p.address      || '—',
                purpose:      p.purpose      || '—',
                tier:         getTier(totalFiles),
                validUntil:   formatDate(p.created_at),
                is_verified:  p.is_verified,
                status:       p.status,
                totalFiles,
                activeFiles,
                completedFiles,
                successRate,
            },
        });

    } catch (err) {
        console.error('[getProfile] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET  /api/b2b/dashboard/pricing
// ─────────────────────────────────────────────────────────────────────────────
exports.getPricing = async (req, res) => {
    try {
        const rows = await query(
            `SELECT id, country, country_code, b2b_price, b2c_price,
                    processing_time, working_type, visa_type, status
             FROM b2b_pricing
             ORDER BY country ASC`
        );

        return res.json({ success: true, data: rows, total: rows.length });

    } catch (err) {
        console.error('[getPricing] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET  /api/b2b/dashboard/files
//  Returns all assigned_tasks for the logged-in partner
// ─────────────────────────────────────────────────────────────────────────────
exports.getFiles = async (req, res) => {
    try {
        const rows = await query(
            `SELECT id, user_name, address, passport_number, contact_number,
                    nationality, email, service_type, status, assigned_at, updated_at
             FROM assigned_tasks
             WHERE partner_id = ?
             ORDER BY assigned_at DESC`,
            [req.partnerId]
        );

        const files = rows.map((row) => ({
            id:              row.id,
            client_name:     row.user_name,
            service:         row.service_type,
            submitted_date:  formatDateTime(row.assigned_at),
            updated_at:      formatDateTime(row.updated_at),
            status:          row.status,
            stage:           row.status,
            // Extra details for modal
            passport_number: row.passport_number,
            contact_number:  row.contact_number,
            nationality:     row.nationality  || '—',
            email:           row.email        || '—',
            address:         row.address      || '—',
        }));

        return res.json({ success: true, data: files, total: files.length });

    } catch (err) {
        console.error('[getFiles] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PATCH  /api/b2b/dashboard/files/status
//  Body: { taskId: number, newStatus: string }
//  Partners can move: pending → processing → confirmed → completed | rejected
// ─────────────────────────────────────────────────────────────────────────────
exports.updateFileStatus = async (req, res) => {
    try {
        const { taskId, newStatus } = req.body;

        if (!taskId || !newStatus) {
            return res.status(400).json({ success: false, message: 'taskId and newStatus are required' });
        }

        const ALLOWED = ['pending', 'processing', 'confirmed', 'completed', 'rejected'];
        if (!ALLOWED.includes(newStatus)) {
            return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${ALLOWED.join(', ')}` });
        }

        // Ensure the task actually belongs to this partner
        const existing = await query(
            `SELECT id, status FROM assigned_tasks WHERE id = ? AND partner_id = ?`,
            [taskId, req.partnerId]
        );

        if (!existing.length) {
            return res.status(404).json({ success: false, message: 'Task not found or access denied' });
        }

        await query(
            `UPDATE assigned_tasks SET status = ? WHERE id = ? AND partner_id = ?`,
            [newStatus, taskId, req.partnerId]
        );

        return res.json({ success: true, message: 'Status updated successfully' });

    } catch (err) {
        console.error('[updateFileStatus] Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};