const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const UserController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.createUser);
router.post('/login', UserController.login);
router.post('/register', UserController.register);

// --- TAMBAHAN KHUSUS MOBILE ---
// Endpoint ini dipanggil setelah Flutter berhasil login ke Firebase
router.post('/auth/mobile-sync', authMiddleware, UserController.mobileSync);
// Endpoint buat manggil firebase uid
router.get('/users/firebase/me', authMiddleware, UserController.firebaseGetMe); 
// ------------------------------

router.put('/users/password/me', authMiddleware, UserController.updatePassword);
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), UserController.updateRole);
router.put('/users/:id',authMiddleware, UserController.updateUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);
router.get('/auth/me', authMiddleware, UserController.getMe);

module.exports = router;