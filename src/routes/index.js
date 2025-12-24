const express = require('express');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

const shippingRoutes = require('./shippingRoutes');

router.use(productRoutes);
router.use(userRoutes);
router.use('/shipping', shippingRoutes);

module.exports = router;
