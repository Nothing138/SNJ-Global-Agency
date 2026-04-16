// controllers/workerRequestController.js
const db = require('../config/db');

// ─── Helper: safe promise-based query ────────────────────────────────────────
// Handles both: mysql2 pool (db.promise()) and already-promisified connections
const query = (sql, params = []) => {
    // mysql2 pool with .promise()
    if (typeof db.promise === 'function') {
        return db.promise().query(sql, params).then(([result]) => result);
    }
    // Already promisified (mysql2/promise)
    if (typeof db.execute === 'function') {
        return db.execute(sql, params).then(([result]) => result);
    }
    // Callback-based (mysql / mysql2 without promise)
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ─── Helper: create notification ─────────────────────────────────────────────
const createNotification = async (employer_id, type, title, message, is_urgent = 0) => {
    try {
        await query(
            'INSERT INTO notifications (employer_id, type, title, message, is_urgent) VALUES (?, ?, ?, ?, ?)',
            [employer_id, type, title, message, is_urgent]
        );
    } catch (e) {
        console.error('createNotification error:', e.message);
    }
};

// ─── 1. GET all worker requests for an employer ───────────────────────────────
// GET /api/worker-requests?employer_id=1&status=pending&limit=100
/*exports.getByEmployer = async (req, res) => {
    try {
        const { employer_id, status, limit = 100 } = req.query;
        if (!employer_id) {
            return res.status(400).json({ success: false, message: 'employer_id is required' });
        }

        const conditions = ['wr.employer_id = ?'];
        const params = [parseInt(employer_id)];

        if (status && status !== 'all') {
            conditions.push('wr.status = ?');
            params.push(status);
        }

        const rows = await query(
            `SELECT wr.*, e.company_name AS employer_company
             FROM worker_requests wr
             LEFT JOIN employers e ON e.id = wr.employer_id
             WHERE ${conditions.join(' AND ')}
             ORDER BY wr.created_at DESC
             LIMIT ?`,
            [...params, parseInt(limit)]
        );

        return res.json({ success: true, data: rows });
    } catch (err) {
        console.error('getByEmployer error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};*/
exports.getByEmployer = async (req, res) => {
    try {
        const { employer_id, status, limit = 100 } = req.query;

        // ── Admin: no employer_id = return ALL ──────────────────────────
        if (!employer_id) {
            const rows = await query(
                `SELECT wr.*, 
                        e.company_name AS employer_company, 
                        e.email        AS employer_email
                 FROM worker_requests wr
                 LEFT JOIN employers e ON e.id = wr.employer_id
                 ORDER BY wr.created_at DESC`,
                []
            );
            return res.json({ success: true, data: rows });
        }

        // ── Employer: filter by employer_id ─────────────────────────────
        const conditions = ['wr.employer_id = ?'];
        const params = [parseInt(employer_id)];

        if (status && status !== 'all') {
            conditions.push('wr.status = ?');
            params.push(status);
        }

        const rows = await query(
            `SELECT wr.*, e.company_name AS employer_company, e.email AS employer_email
             FROM worker_requests wr
             LEFT JOIN employers e ON e.id = wr.employer_id
             WHERE ${conditions.join(' AND ')}
             ORDER BY wr.created_at DESC
             LIMIT ?`,
            [...params, parseInt(limit)]
        );

        return res.json({ success: true, data: rows });
    } catch (err) {
        console.error('getByEmployer error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 2. Employer submits a new worker request ─────────────────────────────────
// POST /api/worker-requests
exports.create = async (req, res) => {
    try {
        console.log('POST /worker-requests body:', req.body); // debug log

        const {
            employer_id, company_name, job_title,
            workers_requested, destination_country, country_flag, notes
        } = req.body;

        // Validate required fields
        if (!employer_id || !company_name || !job_title || !workers_requested || !destination_country) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: employer_id, company_name, job_title, workers_requested, destination_country'
            });
        }

        const workerCount = parseInt(workers_requested);
        if (isNaN(workerCount) || workerCount <= 0) {
            return res.status(400).json({ success: false, message: 'workers_requested must be a positive number' });
        }

        const result = await query(
            `INSERT INTO worker_requests
             (employer_id, company_name, job_title, workers_requested, destination_country, country_flag, notes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_review')`,
            [
                parseInt(employer_id),
                company_name.trim(),
                job_title.trim(),
                workerCount,
                destination_country.trim(),
                country_flag ? country_flag.trim().toLowerCase() : null,
                notes ? notes.trim() : null
            ]
        );

        const newId = result.insertId;
        console.log('Inserted worker request ID:', newId); // debug log

        // Auto-notify employer
        await createNotification(
            parseInt(employer_id),
            'deal',
            'Worker Request Submitted',
            `Your request for ${workerCount} ${job_title} workers in ${destination_country} has been submitted and is pending admin review. Request ID: REQ-${newId}.`,
            0
        );

        return res.status(201).json({
            success: true,
            data: { id: newId },
            message: 'Worker request submitted successfully. Pending admin review.'
        });
    } catch (err) {
        console.error('create worker request error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 3. Admin updates request status / progress ───────────────────────────────
// PUT /api/worker-requests/:id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            workers_delivered, workers_submitted,
            workers_verified, workers_selected,
            status, notes
        } = req.body;

        const existing = await query('SELECT * FROM worker_requests WHERE id = ?', [parseInt(id)]);
        if (!existing.length) {
            return res.status(404).json({ success: false, message: 'Worker request not found' });
        }

        const current = existing[0];
        const fields = [];
        const params = [];

        if (workers_delivered !== undefined) { fields.push('workers_delivered = ?'); params.push(parseInt(workers_delivered)); }
        if (workers_submitted !== undefined) { fields.push('workers_submitted = ?'); params.push(parseInt(workers_submitted)); }
        if (workers_verified  !== undefined) { fields.push('workers_verified = ?');  params.push(parseInt(workers_verified));  }
        if (workers_selected  !== undefined) { fields.push('workers_selected = ?');  params.push(parseInt(workers_selected));  }
        if (status            !== undefined) { fields.push('status = ?');            params.push(status);                      }
        if (notes             !== undefined) { fields.push('notes = ?');             params.push(notes.trim());                }

        if (!fields.length) {
            return res.status(400).json({ success: false, message: 'Nothing to update' });
        }

        params.push(parseInt(id));
        await query(`UPDATE worker_requests SET ${fields.join(', ')} WHERE id = ?`, params);

        // Auto-notifications on status change
        if (status && status !== current.status) {
            const reqLabel = `${current.job_title} (${current.destination_country}) — REQ-${id}`;
            const notifMap = {
                in_progress:    { type: 'supply', title: 'Request Approved — In Progress',   message: `Your worker request for ${reqLabel} has been approved and is now in progress. We are sourcing candidates.`, urgent: 0 },
                delivering:     { type: 'supply', title: 'Workers Being Delivered',           message: `Workers for your request ${reqLabel} are now being delivered. Check the progress dashboard for real-time updates.`, urgent: 0 },
                completed:      { type: 'verify', title: 'Request Completed ✓',               message: `Your worker request ${reqLabel} has been completed successfully. All workers have been delivered.`, urgent: 0 },
                pending_review: { type: 'info',   title: 'Request Sent Back for Review',      message: `Your worker request ${reqLabel} has been sent back to pending review. Please check for any updates or contact support.`, urgent: 1 },
                cancelled:      { type: 'alert',  title: 'Request Cancelled',                 message: `Your worker request ${reqLabel} has been cancelled by the admin. Please contact support for more information.`, urgent: 1 },
            };
            if (notifMap[status]) {
                const n = notifMap[status];
                await createNotification(current.employer_id, n.type, n.title, n.message, n.urgent);
            }
        }

        // Delivery milestone notifications
        if (workers_delivered !== undefined) {
            const newDelivered = parseInt(workers_delivered);
            const total = current.workers_requested;
            const oldPct = total > 0 ? Math.round(((current.workers_delivered || 0) / total) * 100) : 0;
            const newPct = total > 0 ? Math.round((newDelivered / total) * 100) : 0;

            if (oldPct < 50 && newPct >= 50) {
                await createNotification(current.employer_id, 'supply', 'Delivery Milestone: 50%',
                    `${newDelivered} of ${total} workers for ${current.job_title} (${current.destination_country}) have been delivered — 50% complete.`, 0);
            } else if (oldPct < 100 && newPct >= 100) {
                await createNotification(current.employer_id, 'verify', 'All Workers Delivered',
                    `All ${total} workers for ${current.job_title} (${current.destination_country}) have been successfully delivered.`, 0);
            }
        }

        return res.json({ success: true, message: 'Worker request updated successfully' });
    } catch (err) {
        console.error('update worker request error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 4. Get single worker request ─────────────────────────────────────────────
// GET /api/worker-requests/:id
exports.getById = async (req, res) => {
    try {
        const rows = await query(
            `SELECT wr.*, e.company_name AS employer_company, e.email AS employer_email
             FROM worker_requests wr
             LEFT JOIN employers e ON e.id = wr.employer_id
             WHERE wr.id = ?`,
            [parseInt(req.params.id)]
        );
        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'Worker request not found' });
        }
        return res.json({ success: true, data: rows[0] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 5. Delete worker request ─────────────────────────────────────────────────
// DELETE /api/worker-requests/:id
exports.remove = async (req, res) => {
    try {
        const result = await query('DELETE FROM worker_requests WHERE id = ?', [parseInt(req.params.id)]);
        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Worker request not found' });
        }
        return res.json({ success: true, message: 'Worker request deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 6. Get all notifications for employer ────────────────────────────────────
// GET /api/notifications?employer_id=1&unread=true
exports.getNotifications = async (req, res) => {
    try {
        const { employer_id, unread } = req.query;
        if (!employer_id) {
            return res.status(400).json({ success: false, message: 'employer_id is required' });
        }

        const conditions = ['employer_id = ?'];
        const params = [parseInt(employer_id)];

        if (unread === 'true') {
            conditions.push('is_read = 0');
        }

        const rows = await query(
            `SELECT * FROM notifications WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT 50`,
            params
        );

        const unread_count = rows.filter(n => !n.is_read).length;
        return res.json({ success: true, data: rows, unread_count });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 7. Mark single notification as read ──────────────────────────────────────
// PUT /api/notifications/:id/read
exports.markRead = async (req, res) => {
    try {
        const result = await query(
            'UPDATE notifications SET is_read = 1 WHERE id = ?',
            [parseInt(req.params.id)]
        );
        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        return res.json({ success: true, message: 'Marked as read' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 8. Mark all notifications as read ───────────────────────────────────────
// PUT /api/notifications/read-all?employer_id=1
exports.markAllRead = async (req, res) => {
    try {
        const { employer_id } = req.query;
        if (!employer_id) {
            return res.status(400).json({ success: false, message: 'employer_id is required' });
        }
        await query(
            'UPDATE notifications SET is_read = 1 WHERE employer_id = ?',
            [parseInt(employer_id)]
        );
        return res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const rows = await query(
            `SELECT wr.*, 
                    e.company_name AS employer_company, 
                    e.email        AS employer_email
             FROM worker_requests wr
             LEFT JOIN employers e ON e.id = wr.employer_id
             ORDER BY wr.created_at DESC`,
            []
        );
        return res.json({ success: true, data: rows });
    } catch (err) {
        console.error('getAllRequests error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};