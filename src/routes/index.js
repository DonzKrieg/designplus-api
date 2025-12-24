const express = require('express');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

const shippingRoutes = require('./shippingRoutes');

router.use('/shipping', shippingRoutes);
router.use('/products', productRoutes);
router.use('/', userRoutes);

module.exports = router;
