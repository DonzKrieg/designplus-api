const express = require('express');
const router = express.Router();
const productController = require ('../controllers/productControllers');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authJwt = require('../middlewares/authJwt.middleware');
const authFirebase = require('../middlewares/authFirebase.middleware');
const authEither = [authJwt, authFirebase];

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/',authMiddleware, roleMiddleware('admin'), productController.createProduct);
router.put('/:id',authMiddleware, roleMiddleware('admin'), productController.updateProduct);
router.delete('/:id',authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

module.exports = router;