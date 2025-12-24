const express = require('express');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/products', productRoutes);
router.use('/', userRoutes);

module.exports = router;
