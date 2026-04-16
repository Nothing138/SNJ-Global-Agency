/* b2bPricingRoutes.js
const express = require('express');
const router  = express.Router();

const {
    getPricing,
    getPricingById,
    createPricing,
    updatePricing,
    updateStatus,
    deletePricing,
    bulkUpdate,
} = require('../controllers/b2bPricingController');

// ─────────────────────────────────────────────────────────────
// IMPORTANT: /bulk MUST be before /:id
// ─────────────────────────────────────────────────────────────

// GET    /api/b2b/pricing              → all with pagination, filter, sort
router.get('/',             getPricing);

// POST   /api/b2b/pricing              → create new record  ← NEW
router.post('/',            createPricing);

// PUT    /api/b2b/pricing/bulk         → bulk update
router.put('/bulk',         bulkUpdate);

// GET    /api/b2b/pricing/:id          → single record
router.get('/:id',          getPricingById);

// PUT    /api/b2b/pricing/:id          → full update (modal)
router.put('/:id',          updatePricing);

// PATCH  /api/b2b/pricing/:id/status   → status only (dropdown)
router.patch('/:id/status', updateStatus);

// DELETE /api/b2b/pricing/:id          → delete
router.delete('/:id',       deletePricing);

module.exports = router;*/

// b2bRoutes.js  (updated — replaces your existing b2bPricingRoutes.js)
// b2bRoutes.js — FIXED (route ordering corrected)
const express = require('express');
const router  = express.Router();

// ── Visa / B2B Pricing Controller ───────────────────────────
const {
    getPricing,
    getPricingById,
    createPricing,
    updatePricing,
    updateStatus,
    deletePricing,
    bulkUpdate,
} = require('../controllers/b2bPricingController');

// ── Travel Packages Controller ───────────────────────────────
const {
    getTravel, getTravelById, createTravel,
    updateTravel, updateTravelStatus, deleteTravel,
} = require('../controllers/travelPackagesController');

// ── Citizenship Programs Controller ──────────────────────────
const {
    getCitizenship, getCitizenshipById, createCitizenship,
    updateCitizenship, updateCitizenshipStatus, deleteCitizenship,
} = require('../controllers/citizenshipProgramsController');


// ════════════════════════════════════════════════════════════
// TRAVEL PACKAGES — /api/b2b/travel
// ⚠️ MUST be defined BEFORE /:id routes to avoid conflicts
// ════════════════════════════════════════════════════════════
router.get('/travel',              getTravel);
router.post('/travel',             createTravel);
router.get('/travel/:id',          getTravelById);
router.put('/travel/:id',          updateTravel);
router.patch('/travel/:id/status', updateTravelStatus);
router.delete('/travel/:id',       deleteTravel);


// ════════════════════════════════════════════════════════════
// CITIZENSHIP PROGRAMS — /api/b2b/citizenship
// ⚠️ MUST be defined BEFORE /:id routes to avoid conflicts
// ════════════════════════════════════════════════════════════
router.get('/citizenship',              getCitizenship);
router.post('/citizenship',             createCitizenship);
router.get('/citizenship/:id',          getCitizenshipById);
router.put('/citizenship/:id',          updateCitizenship);
router.patch('/citizenship/:id/status', updateCitizenshipStatus);
router.delete('/citizenship/:id',       deleteCitizenship);


// ════════════════════════════════════════════════════════════
// VISA / B2B PRICING — /api/b2b/pricing
// ⚠️ /:id wildcard routes MUST come LAST
// ════════════════════════════════════════════════════════════
router.get('/',             getPricing);
router.post('/',            createPricing);
router.put('/bulk',         bulkUpdate);       // /bulk BEFORE /:id
router.get('/:id',          getPricingById);
router.put('/:id',          updatePricing);
router.patch('/:id/status', updateStatus);
router.delete('/:id',       deletePricing);


module.exports = router;