const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPaymentAndNotify } = require('../controllers/paymentController');

// POST /api/payment/create-intent
router.post('/create-intent', createPaymentIntent);

router.post('/confirm-notification', confirmPaymentAndNotify);

module.exports = router;