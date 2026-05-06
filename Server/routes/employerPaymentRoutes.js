const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/employerPaymentController');

router.post('/create-session', ctrl.createCheckoutSession);  // Stripe session তৈরি
router.post('/webhook',        ctrl.handleWebhook);          // Stripe webhook (optional)
router.post('/record',         ctrl.recordPayment);          // Manual record after success

module.exports = router;