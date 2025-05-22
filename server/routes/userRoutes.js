const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/userController');

router.get('/', getUsers); // Test için kullanıcıları listele
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router; 