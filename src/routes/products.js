const express = require('express');

const router = express.Router();

const ProductsController = require('../app/controllers/ProductsController');

router.get('/:slug', ProductsController.productDetail);

router.get('/infor/:id',ProductsController.productInfor)


module.exports = router;
