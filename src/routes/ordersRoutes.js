const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// User
router.get('/my', authMiddleware, ordersController.getOrdersByUserId);
router.post('/', ordersController.createOrder);
router.get('/:id/messages', authMiddleware, messageController.getMessages);
router.post('/:id/messages', authMiddleware, messageController.sendMessage);

// Admin
router.get('/',authMiddleware, roleMiddleware('admin'), ordersController.getAllOrders);
router.get('/:id', authMiddleware, roleMiddleware('admin'), ordersController.getOrderById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), ordersController.updateOrder);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ordersController.deleteOrder);

module.exports = router;