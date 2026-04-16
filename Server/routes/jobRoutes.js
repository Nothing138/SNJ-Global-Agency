const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authorize = require('../middleware/authMiddleware'); // Middleware function-ta nilam

router.post('/post', authorize(['superadmin', 'admin', 'hr_manager', 'recruiter']), jobController.postJob);

router.put('/update/:id', jobController.updateJob);

router.delete('/delete/:id', jobController.deleteJob);

router.get('/all', jobController.getAllJobsAdmin);

module.exports = router;