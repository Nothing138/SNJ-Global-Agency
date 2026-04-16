const express = require('express');
const router = express.Router();
const { createBlog } = require('../controllers/blogController');
const  authorize = require('../middleware/authMiddleware');


router.post('/', authorize(['superadmin']), createBlog);

module.exports = router;