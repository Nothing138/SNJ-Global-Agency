// b2bdashboardRoutes.js

const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const {
    getProfile,
    getPricing,
    getFiles,
    updateFileStatus,
} = require('../controllers/B2bdashboardcontroller'); // adjust path if needed

// ─────────────────────────────────────────────────────────────────────────────
//  JWT Auth Middleware
// ─────────────────────────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied: no token provided' });
    }

    try {
        const secret  = process.env.JWT_SECRET || 'your_jwt_secret_here';
        const decoded = jwt.verify(token, secret);

        if (!decoded?.id) {
            return res.status(401).json({ success: false, message: 'Invalid token payload' });
        }

        req.partnerId = decoded.id;
        next();

    } catch (err) {
        const message = err.name === 'TokenExpiredError'
            ? 'Token expired, please log in again'
            : 'Invalid token';
        return res.status(401).json({ success: false, message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  Routes — all protected by authMiddleware
//
//  GET   /api/b2b/dashboard/profile        → partner profile + real stats
//  GET   /api/b2b/dashboard/pricing        → full B2B pricing table
//  GET   /api/b2b/dashboard/files          → partner's assigned tasks (files)
//  PATCH /api/b2b/dashboard/files/status   → update a file's status
// ─────────────────────────────────────────────────────────────────────────────
router.get  ('/profile',       authMiddleware, getProfile);
router.get  ('/pricing',       authMiddleware, getPricing);
router.get  ('/files',         authMiddleware, getFiles);
router.patch('/files/status',  authMiddleware, updateFileStatus);

module.exports = router;

// ─────────────────────────────────────────────────────────────────────────────
//  Register in app.js / server.js:
//
//  const dashboardRoutes = require('./routes/b2bdashboardRoutes');
//  app.use('/api/b2b/dashboard', dashboardRoutes);
// ─────────────────────────────────────────────────────────────────────────────