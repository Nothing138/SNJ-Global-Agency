// controllers/workerRequestController.js
const db = require('../config/db');

// ─── Helper: safe promise-based query ────────────────────────────────────────
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

// ─── 1. GET all worker requests ───────────────────────────────────────────────
exports.getByEmployer = async (req, res) => {
    try {
        const { employer_id, status, limit = 100 } = req.query;

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

// ─── 2. Create worker request ─────────────────────────────────────────────────
exports.create = async (req, res) => {
    try {
        const {
            employer_id, company_name, job_title,
            workers_requested, destination_country, country_flag, notes
        } = req.body;

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

// ─── 3. Admin updates request ─────────────────────────────────────────────────
// PUT /api/worker-requests/:id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            workers_delivered, workers_submitted,
            workers_verified, workers_selected,
            status, notes,
            total_paid, due_payment   // ← নতুন যোগ হয়েছে
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

        // ── Amount fields ──────────────────────────────────────────────────────
        if (total_paid !== undefined) {
            const paid = parseFloat(total_paid);
            if (isNaN(paid) || paid < 0) {
                return res.status(400).json({ success: false, message: 'total_paid must be a non-negative number' });
            }
            fields.push('total_paid = ?');
            params.push(paid);
        }
        if (due_payment !== undefined) {
            const due = parseFloat(due_payment);
            if (isNaN(due) || due < 0) {
                return res.status(400).json({ success: false, message: 'due_payment must be a non-negative number' });
            }
            fields.push('due_payment = ?');
            params.push(due);
        }
        // ──────────────────────────────────────────────────────────────────────

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

// ─── 4. NEW: Set Amount only (quick action from table row) ────────────────────
// PUT /api/worker-requests/:id/set-amount
exports.setAmount = async (req, res) => {
    try {
        const { id } = req.params;
        const { total_paid, due_payment } = req.body;

        if (total_paid === undefined && due_payment === undefined) {
            return res.status(400).json({ success: false, message: 'Provide total_paid or due_payment' });
        }

        const existing = await query('SELECT id FROM worker_requests WHERE id = ?', [parseInt(id)]);
        if (!existing.length) {
            return res.status(404).json({ success: false, message: 'Worker request not found' });
        }

        const fields = [];
        const params = [];

        if (total_paid !== undefined) {
            const paid = parseFloat(total_paid);
            if (isNaN(paid) || paid < 0) {
                return res.status(400).json({ success: false, message: 'total_paid must be a non-negative number' });
            }
            fields.push('total_paid = ?');
            params.push(paid);
        }
        if (due_payment !== undefined) {
            const due = parseFloat(due_payment);
            if (isNaN(due) || due < 0) {
                return res.status(400).json({ success: false, message: 'due_payment must be a non-negative number' });
            }
            fields.push('due_payment = ?');
            params.push(due);
        }

        params.push(parseInt(id));
        await query(`UPDATE worker_requests SET ${fields.join(', ')} WHERE id = ?`, params);

        return res.json({ success: true, message: 'Amount updated successfully' });
    } catch (err) {
        console.error('setAmount error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ─── 5. Get single worker request ─────────────────────────────────────────────
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

// ─── 6. Delete worker request ─────────────────────────────────────────────────
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

// ─── 7. Get all notifications for employer ────────────────────────────────────
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

// ─── 8. Mark single notification as read ──────────────────────────────────────
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

// ─── 9. Mark all notifications as read ───────────────────────────────────────
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

// ─── 10. Get all requests (admin) ─────────────────────────────────────────────
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