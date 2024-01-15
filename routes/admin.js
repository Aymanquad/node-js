const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const Auth = require('../auth_protection/auth_middleware');

const router = express.Router();                          //basically , using this to route our stuff throu files.

// /add-product => GET
router.get('/add-product', Auth , adminController.getAddProduct);

// /products => GET
router.get('/admin-products' , Auth , adminController.getProducts);

// /add-product => POST
router.post('/add-product', Auth , adminController.postAddProduct);

router.get('/edit-product/:productId' , Auth , adminController.getEditProduct);

router.post('/edit-product' , Auth , adminController.postEditProduct);
  
router.post('/delete-product', Auth  , adminController.postDeleteProduct);

module.exports = router;
