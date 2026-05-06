// routes/employerRoutes.js

const express = require('express');
const router  = express.Router();

const employerController       = require('../controllers/employerController');
const workerRequestController  = require('../controllers/workerRequestController');

// ─── Employer Routes (/api/employer) ──────────────────────────────────────────
const employerRouter = express.Router();

employerRouter.post('/send-otp',  employerController.sendOtp);
employerRouter.post('/register',  employerController.registerEmployer);

employerRouter.get('/list',       employerController.getAllEmployers);
employerRouter.get('/:id',        employerController.getEmployerById);
employerRouter.put('/status/:id', employerController.updateStatus);
employerRouter.delete('/:id',     employerController.deleteEmployer);

// ─── Worker Request Routes (/api/worker-requests) ─────────────────────────────
const workerRouter = express.Router();

workerRouter.get('/',              workerRequestController.getAllRequests);
workerRouter.post('/',             workerRequestController.create);
workerRouter.put('/:id/set-amount', workerRequestController.setAmount);   // ← নতুন: Amount সেট করার route
workerRouter.put('/:id',           workerRequestController.update);
workerRouter.delete('/:id',        workerRequestController.remove);

// ─── Notification Routes (/api/notifications) ─────────────────────────────────
const notifRouter = express.Router();

notifRouter.get('/',          workerRequestController.getNotifications);
notifRouter.put('/read-all',  workerRequestController.markAllRead);
notifRouter.put('/:id/read',  workerRequestController.markRead);

// ─── Mount ────────────────────────────────────────────────────────────────────
router.use('/employer',        employerRouter);
router.use('/worker-requests', workerRouter);
router.use('/notifications',   notifRouter);

module.exports = router;