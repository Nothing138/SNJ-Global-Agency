// routes/applicantTrackingRoutes.js
// Mount: app.use('/api/applicants', require('./routes/applicantTrackingRoutes'));

const express = require('express');
const router  = express.Router();
const {
  getAllApplicants,
  getApplicantById,
  updateTracking,
  updateAccountStatus,
  getApplicantDocuments,
  updateDocumentStatus,
  bulkUpdateTracking,
} = require('../controllers/applicantTrackingController');

router.get('/',                              getAllApplicants);
router.get('/:id',                           getApplicantById);
router.patch('/:id/tracking',                updateTracking);
router.patch('/:id/status',                  updateAccountStatus);
router.get('/:id/documents',                 getApplicantDocuments);
router.patch('/documents/:docId/status',     updateDocumentStatus);
router.post('/bulk-update',                  bulkUpdateTracking);

module.exports = router;