const express = require('express');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const ordersRoutes = require('./ordersRoutes');
const cartRoutes = require('./cartRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

const shippingRoutes = require('./shippingRoutes');

router.use('/chat', chatRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/shipping', shippingRoutes);
router.use('/products', productRoutes);
router.use('/', userRoutes);

module.exports = router;
