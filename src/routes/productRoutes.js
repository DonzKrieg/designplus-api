const express = require('express');
const router = express.Router();
const productController = require ('../controllers/productControllers');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.use(roleMiddleware('admin'));

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;