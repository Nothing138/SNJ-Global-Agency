const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Save message to DB
router.post('/send', messageController.saveMessage);

// Get chat between two users
router.get('/history/:user1/:user2', messageController.getMessages);

// Get list of users who messaged the admin
router.get('/chat-list', messageController.getChatList);

module.exports = router;