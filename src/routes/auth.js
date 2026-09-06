const express = require('express');

const router = express.Router();

const AuthController = require('../app/controllers/AuthController');
const {requireToken} = require('../middleware/auth')

router.get('/login', AuthController.login);
router.post('/handle-login', AuthController.handleLogin);
router.get('/signup', AuthController.signup);
router.post('/handle-signup', AuthController.handleSignup);


module.exports = router;
