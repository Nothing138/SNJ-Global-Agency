// controllers/applicantTrackingController.js

const db = require('../config/db');

const VALID_PROGRESS = [0, 25, 50, 75, 100];
const VALID_STATUS   = ['pending', 'approved', 'suspended'];

// GET /api/applicants
const getAllApplicants = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         u.id, u.full_name, u.email,
         u.status     AS account_status,
         u.created_at AS joined_at,
         COALESCE(t.visa,   0)  AS visa,
         COALESCE(t.job,    0)  AS job,
         COALESCE(t.flight, 0)  AS flight,
         COALESCE(t.trip,   0)  AS trip,
         COALESCE(t.notes, '')  AS notes,
         t.updated_at           AS last_updated
       FROM users u
       LEFT JOIN applicant_tracking t ON t.user_id = u.id
       WHERE u.role = 'candidate'
       ORDER BY u.created_at DESC`
    );
    return res.json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    console.error('[getAllApplicants]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/applicants/:id
const getApplicantById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
         u.id, u.full_name, u.email,
         u.status     AS account_status,
         u.created_at AS joined_at,
         COALESCE(t.visa,   0)  AS visa,
         COALESCE(t.job,    0)  AS job,
         COALESCE(t.flight, 0)  AS flight,
         COALESCE(t.trip,   0)  AS trip,
         COALESCE(t.notes, '')  AS notes,
         t.updated_at           AS last_updated
       FROM users u
       LEFT JOIN applicant_tracking t ON t.user_id = u.id
       WHERE u.id = ? AND u.role = 'candidate'`, [id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[getApplicantById]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/applicants/:id/tracking
const updateTracking = async (req, res) => {
  const { id } = req.params;
  const { visa, job, flight, trip, notes, updated_by } = req.body;

  const updates = {};
  for (const [key, val] of Object.entries({ visa, job, flight, trip })) {
    if (val !== undefined && val !== null && val !== '') {
      const num = parseInt(val, 10);
      if (!VALID_PROGRESS.includes(num))
        return res.status(400).json({ success: false, message: `Invalid value for "${key}". Allowed: 0,25,50,75,100` });
      updates[key] = num;
    }
  }
  if (notes      !== undefined) updates.notes      = notes;
  if (updated_by !== undefined) updates.updated_by = updated_by;
  if (!Object.keys(updates).length)
    return res.status(400).json({ success: false, message: 'No valid fields to update' });

  try {
    const [check] = await db.query(
      `SELECT id FROM users WHERE id = ? AND role = 'candidate'`, [id]
    );
    if (!check.length)
      return res.status(404).json({ success: false, message: 'Candidate not found' });

    await db.query(
      `INSERT INTO applicant_tracking (user_id) VALUES (?)
       ON DUPLICATE KEY UPDATE user_id = user_id`, [id]
    );
    const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    await db.query(
      `UPDATE applicant_tracking SET ${setClauses} WHERE user_id = ?`,
      [...Object.values(updates), id]
    );

    const [rows] = await db.query(
      `SELECT u.id, u.full_name, u.email, u.status AS account_status,
         COALESCE(t.visa,0) AS visa, COALESCE(t.job,0) AS job,
         COALESCE(t.flight,0) AS flight, COALESCE(t.trip,0) AS trip,
         COALESCE(t.notes,'') AS notes, t.updated_at AS last_updated
       FROM users u LEFT JOIN applicant_tracking t ON t.user_id = u.id
       WHERE u.id = ?`, [id]
    );
    return res.json({ success: true, message: 'Tracking updated', data: rows[0] });
  } catch (err) {
    console.error('[updateTracking]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ PATCH /api/applicants/:id/status  — update users.status
const updateAccountStatus = async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUS.includes(status))
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed: ${VALID_STATUS.join(', ')}`,
    });

  try {
    const [check] = await db.query(
      `SELECT id FROM users WHERE id = ? AND role = 'candidate'`, [id]
    );
    if (!check.length)
      return res.status(404).json({ success: false, message: 'Candidate not found' });

    await db.query(`UPDATE users SET status = ? WHERE id = ?`, [status, id]);

    return res.json({
      success: true,
      message: `Status updated to "${status}"`,
      data: { id: parseInt(id), account_status: status },
    });
  } catch (err) {
    console.error('[updateAccountStatus]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/applicants/bulk-update
const bulkUpdateTracking = async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates) || !updates.length)
    return res.status(400).json({ success: false, message: 'updates array required' });

  try {
    for (const item of updates) {
      const { user_id, visa, job, flight, trip, notes, updated_by } = item;
      if (!user_id) continue;
      const rowUpdates = {};
      for (const [key, val] of Object.entries({ visa, job, flight, trip })) {
        if (val !== undefined && val !== null) {
          const num = parseInt(val, 10);
          if (VALID_PROGRESS.includes(num)) rowUpdates[key] = num;
        }
      }
      if (notes      !== undefined) rowUpdates.notes      = notes;
      if (updated_by !== undefined) rowUpdates.updated_by = updated_by;
      if (!Object.keys(rowUpdates).length) continue;

      await db.query(
        `INSERT INTO applicant_tracking (user_id) VALUES (?)
         ON DUPLICATE KEY UPDATE user_id = user_id`, [user_id]
      );
      const setClauses = Object.keys(rowUpdates).map(k => `\`${k}\` = ?`).join(', ');
      await db.query(
        `UPDATE applicant_tracking SET ${setClauses} WHERE user_id = ?`,
        [...Object.values(rowUpdates), user_id]
      );
    }
    return res.json({ success: true, message: `${updates.length} records processed` });
  } catch (err) {
    console.error('[bulkUpdateTracking]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllApplicants,
  getApplicantById,
  updateTracking,
  updateAccountStatus,
  bulkUpdateTracking,
};