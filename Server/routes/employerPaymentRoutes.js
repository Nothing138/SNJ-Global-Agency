// routes/employerPaymentRoutes.js — FULL UPDATED FILE

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/employerPaymentController');

// POST /api/employer-payment/create-session  → Stripe Checkout session
router.post('/create-session', ctrl.createCheckoutSession);

// POST /api/employer-payment/webhook         → Stripe webhook (raw body required)
router.post('/webhook', ctrl.handleWebhook);

// POST /api/employer-payment/record          → Manual record after success
router.post('/record', ctrl.recordPayment);

// GET  /api/employer-payment/history         → Payment history for employer
router.get('/history', ctrl.getPaymentHistory);

module.exports = router;

// ─── Register in app.js / server.js ──────────────────────────────────────────
// const employerPaymentRoutes = require('./routes/employerPaymentRoutes');
// app.use('/api/employer-payment', employerPaymentRoutes);
//
// IMPORTANT: Webhook route needs raw body — add BEFORE express.json():
// app.use('/api/employer-payment/webhook', express.raw({ type: 'application/json' }));