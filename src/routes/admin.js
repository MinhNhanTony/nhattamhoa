const express = require('express');
const multer = require('multer');
const router = express.Router();
multer().single("undefined")
const AdminController = require('../app/controllers/AdminController');
const {requireAdminToken} = require('../middleware/auth');
const ProductModel = require('../app/models/Product');
const {deleteFile} = require('../middleware/deleteFile')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './src/public/img' + '/Products');
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
    // Sets saved filename(s) to be original filename(s)
})

  
// Set saved storage options:
const upload = multer({ storage: storage })



router.get('/orders/:token',requireAdminToken, AdminController.order);
router.get('/products/:token',requireAdminToken, AdminController.product);
router.get('/delete-product/:id/:token',requireAdminToken, AdminController.deleteProduct);
router.get('/toggle-product/:id/:token',requireAdminToken, AdminController.toggleProduct);
router.get('/edit-product/:id/:token/',upload.array("files"), AdminController.editProduct);
router.post('/edit-product/:id/:token/:haveFile',requireAdminToken,deleteFile,upload.array("files"), AdminController.editProductHandle);

router.get('/order-detail/:id/:token', requireAdminToken,AdminController.orderDetail);

router.get('/them-san-pham/:token',requireAdminToken, AdminController.addproductView);
router.post('/them-san-pham/:token',upload.array("files"),requireAdminToken, AdminController.addproduct);

router.post('/change-order-infor/:id/:token',requireAdminToken, AdminController.changeOrderInfor);

router.post('/change-order-status/:id/:token',requireAdminToken, AdminController.changeOrderStatus);

router.get('/sua-field-san-pham/:token',requireAdminToken, AdminController.updateProductField);

// Chinh sua hang loat
router.post('/them-field-hang-loat/:token',requireAdminToken, AdminController.addProductField);


module.exports = router;
