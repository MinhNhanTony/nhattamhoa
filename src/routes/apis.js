const express = require('express');

const router = express.Router();

const ApisController = require('../app/controllers/ApisController');

router.post('/productsWithFilter', ApisController.productsWithFilter);
router.get('/provinces', ApisController.getProvinces);
router.post('/calculate-ship-price', ApisController.calculateShipPrice);
router.post('/get-total-price', ApisController.getTotalPrice);
router.get('/category-list', ApisController.getcategoryList);
router.post('/searchOrder', ApisController.searhOrder);

router.get('/token', ApisController.generateToken);


module.exports = router;

