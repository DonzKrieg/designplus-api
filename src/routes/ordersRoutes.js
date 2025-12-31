// const express = require('express');
// const router = express.Router();
// const ordersController = require('../controllers/ordersController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const roleMiddleware = require('../middlewares/roleMiddleware');

// // User
// router.get('/my', authMiddleware, ordersController.getOrdersByUserId);
// router.post('/', ordersController.createOrder);

// // Admin
// router.get('/',authMiddleware, roleMiddleware('admin'), ordersController.getAllOrders);
// router.get('/:id', authMiddleware, roleMiddleware('admin'), ordersController.getOrderById);
// router.put('/:id', authMiddleware, roleMiddleware('admin'), ordersController.updateOrder);
// router.delete('/:id', authMiddleware, roleMiddleware('admin'), ordersController.deleteOrder);

// module.exports = router;

const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ==================================================================
// 1. ROUTE SPESIFIK (Harus diletakkan PALING ATAS)
// Ganti '/my' menjadi '/user' agar sesuai dengan api_service.dart
// ==================================================================
router.get('/user', authMiddleware, ordersController.getOrdersByUserId);

// Route untuk Create Order
router.post('/', ordersController.createOrder);

// ==================================================================
// 2. ROUTE DINAMIS (Menggunakan :id)
// Harus diletakkan SETELAH route spesifik seperti '/user'
// ==================================================================
router.put('/:id', authMiddleware, ordersController.updateOrder);
// Admin Routes
router.get('/', authMiddleware, roleMiddleware('admin'), ordersController.getAllOrders);
router.get('/:id', authMiddleware, roleMiddleware('admin'), ordersController.getOrderById);
// router.put('/:id', authMiddleware, roleMiddleware('admin'), ordersController.updateOrder);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ordersController.deleteOrder);

module.exports = router;