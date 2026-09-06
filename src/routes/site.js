const express = require('express');

const router = express.Router();



const siteController = require('../app/controllers/SiteController');
const authController = require('../app/controllers/AuthController');

router.use('/cart', siteController.cart);
router.use('/login', authController.login);
router.use('/tra-cuu', siteController.searchOrder);
router.use('/handle-login', authController.handleLogin);
router.use('/signup', authController.signup);
router.use('/handle-signup', authController.handleSignup);
router.use('/', siteController.index);


module.exports = router;
