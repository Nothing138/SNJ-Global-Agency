const express = require('express');
const router = express.Router();
const annController = require('../controllers/announcementController');

// User side e shudhu ACTIVE ta dekhate
router.get('/', annController.getAnnouncement);

// Admin dashboard e SHOB list dekhate
router.get('/all', annController.getAllAnnouncements);

// Notun announcement create
router.post('/save', annController.saveAnnouncement);

// Status toggle
router.put('/toggle/:id', annController.toggleStatus);

// Delete
router.delete('/:id', annController.deleteAnnouncement);

module.exports = router;