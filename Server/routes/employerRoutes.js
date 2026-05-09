const express = require('express');
const router  = express.Router();

const employerController       = require('../controllers/employerController');
const workerRequestController  = require('../controllers/workerRequestController');

// ─── Employer Routes (/api/employer) ──────────────────────────────────────────
const employerRouter = express.Router();

employerRouter.post('/send-otp',  employerController.sendOtp);
employerRouter.post('/register',  employerController.registerEmployer);
employerRouter.post('/login',     employerController.loginEmployer);

employerRouter.get('/list',       employerController.getAllEmployers);

// ✅ Specific routes BEFORE /:id
employerRouter.put('/status/:id', employerController.updateStatus);
employerRouter.delete('/:id',     employerController.deleteEmployer);
employerRouter.get('/:id',        employerController.getEmployerById);

// ─── Worker Request Routes (/api/worker-requests) ─────────────────────────────
const workerRouter = express.Router();

workerRouter.get('/',                    workerRequestController.getByEmployer);
workerRouter.post('/record-payment',     workerRequestController.recordPayment); // ✅ specific আগে
workerRouter.post('/',                   workerRequestController.create);
workerRouter.put('/:id/set-amount',      workerRequestController.setAmount);
workerRouter.put('/:id',                 workerRequestController.update);
workerRouter.delete('/:id',             workerRequestController.remove);

// ─── Notification Routes (/api/notifications) ─────────────────────────────────
const notifRouter = express.Router();

notifRouter.get('/',          workerRequestController.getNotifications);
notifRouter.put('/read-all',  workerRequestController.markAllRead); // ✅ specific আগে
notifRouter.put('/:id/read',  workerRequestController.markRead);

// ─── Mount ────────────────────────────────────────────────────────────────────
router.use('/employer',        employerRouter);
router.use('/worker-requests', workerRouter);
router.use('/notifications',   notifRouter);

module.exports = router;