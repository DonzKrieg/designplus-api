const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/messages', authMiddleware, messageController.getMessages);
router.post('/messages', authMiddleware, messageController.sendMessage);

module.exports = router;