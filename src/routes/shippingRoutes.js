// src/routes/shippingRoutes.js

const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

// Route POST untuk cek ongkir
router.post('/cost', shippingController.calculateCost);

module.exports = router;