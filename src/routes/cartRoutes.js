const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, CartController.index);
router.post('/', authMiddleware, CartController.store);
router.put('/:id', authMiddleware, CartController.update);
router.delete('/:id', authMiddleware, CartController.destroy);

// Checkout
router.delete('/', authMiddleware, CartController.clearAfterCheckout);

module.exports = router;
