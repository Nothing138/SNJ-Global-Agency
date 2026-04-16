const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController'); // 👈 Import name thik kora hoise

// Dashboard stats endpoint
router.get('/stats', analyticsController.getDashboardStats);

module.exports = router;