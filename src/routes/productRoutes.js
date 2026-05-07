const express = require('express');
const router = express.Router();
const ProductControllers = require ('../controllers/productControllers');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
<<<<<<< Updated upstream
const upload = require('../middlewares/uploadMiddleware');


router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getProductById);
router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('product_image'), ProductControllers.createProduct);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.single('product_image'), ProductControllers.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ProductControllers.deleteProduct);
=======
 

// kasih throttle biar ga kena ddos attack, misal 100 request per 15 menit
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/',authMiddleware, roleMiddleware('admin'), productController.createProduct);
router.put('/:id',authMiddleware, roleMiddleware('admin'), productController.updateProduct);
router.delete('/:id',authMiddleware, roleMiddleware('admin'), productController.deleteProduct);
>>>>>>> Stashed changes

module.exports = router;