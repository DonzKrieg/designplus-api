const express = require('express');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const ordersRoutes = require('./ordersRoutes');

const router = express.Router();

const shippingRoutes = require('./shippingRoutes');

router.use('/orders', ordersRoutes);
router.use('/shipping', shippingRoutes);
router.use('/products', productRoutes);
router.use('/', userRoutes);

module.exports = router;
