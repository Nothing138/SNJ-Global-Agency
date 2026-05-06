// routes/applicantTrackingRoutes.js
// Mount: app.use('/api/applicants', require('./routes/applicantTrackingRoutes'));

const express = require('express');
const router  = express.Router();
const {
  getAllApplicants,
  getApplicantById,
  updateTracking,
  updateAccountStatus,
  bulkUpdateTracking,
} = require('../controllers/applicantTrackingController');

// GET  /api/applicants
router.get('/', getAllApplicants);

// GET  /api/applicants/:id
router.get('/:id', getApplicantById);

// PATCH /api/applicants/:id/tracking  → visa/job/flight/trip
router.patch('/:id/tracking', updateTracking);

// ✅ PATCH /api/applicants/:id/status  → pending/approved/suspended
router.patch('/:id/status', updateAccountStatus);

// POST /api/applicants/bulk-update
router.post('/bulk-update', bulkUpdateTracking);

module.exports = router;