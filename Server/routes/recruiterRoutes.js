const express = require('express');
const router = express.Router();
const { createRecruiter, getProfile, updateRecruiter } = require('../controllers/recruiterController');
const upload = require('../middleware/uploadMiddleware'); // Tumar upload middleware

router.post('/register', upload.fields([{ name: 'logo' }, { name: 'docs' }]), createRecruiter);
router.get('/profile/:userId', getProfile);
router.post('/update', upload.fields([{ name: 'logo' }]), updateRecruiter);

module.exports = router;