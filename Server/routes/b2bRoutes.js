const express = require('express');
const router = express.Router();
const b2bController = require('../controllers/b2bController');

// ওটিপি পাঠানোর জন্য
router.post('/send-otp', b2bController.sendOtp);

// রেজিস্ট্রেশন করার জন্য
router.post('/register', b2bController.registerB2B);

router.get('/list', b2bController.getAllB2B);
router.put('/status/:id', b2bController.updateB2BStatus);
router.delete('/:id', b2bController.deleteB2B);

module.exports = router;