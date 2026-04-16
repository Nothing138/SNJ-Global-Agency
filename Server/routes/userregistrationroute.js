const express = require('express');
const router = express.Router();
const { sendOTP, registerUser } = require('../controllers/userregistrationController');

// 1. OTP pathanor route
router.post('/send-otp', sendOTP);

// 2. Final registration route
router.post('/register', registerUser);

module.exports = router;