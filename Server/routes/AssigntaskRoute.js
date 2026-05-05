const express = require('express');
const router  = express.Router();
const {
    getActivePartners,
    getServiceCountries,
    assignTask,
    getAssignedTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
} = require('../controllers/AssigntaskController');

// Dropdown data
router.get('/active-partners',       getActivePartners);
router.get('/service-countries',     getServiceCountries);

// CRUD
router.get('/assigned-tasks',        getAssignedTasks);
router.get('/assigned-tasks/:id',    getTaskById);
router.post('/assign-task',          assignTask);
router.put('/assigned-tasks/:id',    updateTask);
router.patch('/task-status/:id',     updateTaskStatus);
router.delete('/assigned-tasks/:id', deleteTask);

module.exports = router;