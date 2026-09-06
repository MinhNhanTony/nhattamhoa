const express = require('express');

const router = express.Router();

const CollectionsController = require('../app/controllers/CollectionsController');

router.get('/tat-ca-san-pham', CollectionsController.allProduct);
router.get('/san-pham-moi', CollectionsController.newArrivalProduct);

router.get('/san-pham-nam', CollectionsController.maleProduct);
router.get('/san-pham-nu', CollectionsController.femaleProduct);
router.get('/unisex', CollectionsController.unisexProduct);
router.get('/sale', CollectionsController.saleProduct);
router.get('/category/:name', CollectionsController.categoryProduct);

module.exports = router;
