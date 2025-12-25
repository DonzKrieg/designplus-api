const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// User
router.get('/my', authMiddleware, ordersController.getOrdersByUserId);
router.post('/', authMiddleware, ordersController.createOrder);

// Admin
router.get('/',authMiddleware, roleMiddleware('admin'), ordersController.getAllOrders);
router.get('/:id', authMiddleware, roleMiddleware('admin'), ordersController.getOrderById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), ordersController.updateOrder);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ordersController.deleteOrder);

module.exports = router;