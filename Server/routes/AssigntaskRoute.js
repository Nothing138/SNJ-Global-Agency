// routes/AssigntaskRoute.js
const express = require('express');
const router = express.Router();
const {
    getActivePartners,
    getServiceCountries,
    assignTask,
    getAssignedTasks,
    deleteTask,
    updateTaskStatus
} = require('../controllers/AssigntaskController');

router.get('/active-partners',       getActivePartners);    // Partner dropdown
router.get('/service-countries',     getServiceCountries);  // Country+Price by service type
router.get('/assigned-tasks',        getAssignedTasks);     // Task list
router.post('/assign-task',          assignTask);           // Create task
router.delete('/assigned-tasks/:id', deleteTask);           // Delete task
router.put('/update-status/:id',     updateTaskStatus);     // Update status

module.exports = router;