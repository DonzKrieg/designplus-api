const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;
