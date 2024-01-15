const path = require('path');
const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const Auth = require('../auth_protection/auth_middleware');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);         // :(productId) means anything whr we name/access it using name of productId. this is provided by express . 

router.get('/cart' , Auth ,  shopController.getCart);

router.post('/cart', Auth , shopController.postCart);

router.post('/delete-cart-item' , Auth , shopController.postDeleteCartProduct);
router.post('/updatequantity-of-item', Auth  , shopController.postProductQtyUpdate);


router.post('/create-order' , shopController.placeOrder);

router.get('/orders' , shopController.getOrders);

router.get('/checkout' , Auth , shopController.getCheckout);

router.get('/checkout/success' , Auth , shopController.getOrders);

router.get('/checkout/cancel' , Auth , shopController.getCheckout);


module.exports = router;