const express = require('express');

const router = express.Router();

const DiscountsController = require('../app/controllers/DiscountsController');
const {requireToken} = require('../middleware/auth')

router.get('/discount-list', DiscountsController.discount);
router.post('/get-discount', DiscountsController.getDiscountFromId);


module.exports = router;
