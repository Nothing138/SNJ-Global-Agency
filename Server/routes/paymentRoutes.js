const express = require('express');
const router  = express.Router();
const { createPaymentIntent, confirmPaymentAndNotify } = require('../controllers/paymentController');

// POST /api/payment/create-intent
// Creates Stripe PaymentIntent — supports Visa, Mastercard, Amex, UnionPay etc.
router.post('/create-intent', createPaymentIntent);

// POST /api/payment/confirm-notification
// Called from frontend after Stripe confirms payment
// Handles: email notification + DB update (employer dues / b2b credits)
router.post('/confirm-notification', confirmPaymentAndNotify);

module.exports = router;