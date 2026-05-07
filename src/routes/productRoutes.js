const express = require('express');
const router = express.Router();
const ProductControllers = require ('../controllers/productControllers');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');


router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getProductById);
router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('product_image'), ProductControllers.createProduct);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.single('product_image'), ProductControllers.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ProductControllers.deleteProduct);

module.exports = router;