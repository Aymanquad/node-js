const Product = require('../models/product');
const Cart = require('../models/cart');
const stripe = require('stripe')(`${process.env.MONGO_STRIPE_KEY}`);

exports.getProducts = (req, res, next) => {
  // console.log( 'shop.js' , adminData.products);                       accessing the data from the admin file here
  // res.sendFile(path.join(__dirname , '../' , 'views' , 'shop.html'))
  Product.fetchAll()
  .then ( (products) => {
    res.render('shop/product-list', {
      prods: products,
      pgTitle: 'All Products',
      path: '/products',
    });
  })

  .catch(err =>{
    console.log(err);
  });


};

exports.getProduct = (req , res , next ) =>{
  const prod_id = req.params.productId ;                   // express provides an obj called params throu which u can access that name u gave it in routes.
  // console.log("AYYOO prod id is .." , prod_id);
  Product.getByid(prod_id)
    .then(prod_details =>{               
        res.render('shop/product-detail' , {
          product : prod_details,
          pgTitle : prod_details.title,
    })
  })  
    .catch(err=>{
      console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
  //console.log("the auth value is ....." , req.session.loggedIn);

  Product.fetchAll()
    .then(products =>{
      res.render('shop/index', { 
        prods: products,
        pgTitle: 'Shop',
        path: '/',
    })
  })
    .catch(err=>{
      console.log(err);
    });
    
};




exports.getCart = (req, res, next) => {

  req.session.user.getTheCart() 
      .then(products =>{ 

      let totalPrice = 0;
      // console.log("products received are .." , products);
      for (prod of products) {
        //console.log(prod.price); 
        totalPrice = totalPrice +  (parseFloat(prod.price) * prod.quantity ) ;
      }

      totalPrice = totalPrice.toFixed(2);

          res.render('shop/cart', { 
            path: '/cart',
            pgTitle: 'Your Cart',
            products : products, 
            totalPrice : totalPrice ,
          })
        })

      .catch(err =>{
        console.log(err);
      })
};

exports.postCart = (req, res ,  next ) =>{
  const prodId = (req.body.productId).trim() ;
  
  Product.getByid(prodId)
    .then(product=>{     
      return req.session.user.addToCart(product)
        .then(result=>{
          //console.log(result);
          res.redirect('/cart');
        })
        .catch(err=>{
          console.log(err);
        })
  }) 
};


exports.postDeleteCartProduct = (req, res ,  next)=>{
  const prodId = (req.body.productId).trim();
  // console.log(prodId);
  req.session.user.deleteProduct(prodId)
  .then(result=>{
    //console.log(result);
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  })
}

exports.postProductQtyUpdate = (req, res ,  next)=>{
  const prodId = (req.body.productId).trim() ;
  const qty = (req.body.prodQty).trim();
  //console.log(prodId);
    req.session.user.qtyDecrease(prodId)
      .then(result=>{
        //console.log(result);
        res.redirect('/cart');
      })
      .catch(err=>{
        console.log(err);
      })

    //res.redirect('/cart');
}




exports.placeOrder = (req, res, next) => {

  if(!req.session.loggedIn){
    res.redirect('/login');
  }

  req.session.user.addMyOrder()
    .then(result=>{

      //console.log("inside the getOrders func..");
      res.redirect('/orders');
    })
    .catch(err=>{
      console.log(err);
    })
  
};


exports.getOrders = (req , res , next) =>{

  if(!req.session.loggedIn){
    res.redirect('/login');
  }

  req.session.user.getOrders()
    .then(orders=>{
        res.render('shop/orders', {
        path: '/orders',
        pgTitle: 'Your Orders',
        orders : orders,
      })
    })

    .catch(err=>{
      console.log(err);
    })
}



exports.getCheckout = (req, res, next) => {
  let totalPrice =0;
  let products; 
  //accessing cart items and calculating total price
  req.session.user.getTheCart() 
      .then(products =>{ 

        products.map(p=>{
          p.price = p.price.trim();
        })

      totalPrice = 0;
      for (prod of products) {
        totalPrice = totalPrice +  (parseFloat(prod.price) * prod.quantity ) ;
      }
      totalPrice = totalPrice.toFixed(2);

      console.log("products are...",products);

      return stripe.checkout.sessions.create({
        payment_method_types : ['card'],    //payment method is card
        line_items : products.map(p=>{
          //const prod_price = (p.price).trim();
          return {
            name: p.title,
            description: p.description,
            amount: Math.round(p.price * 100), // Convert to cents, assuming p.price is in dollars
            currency: 'inr',
            quantity: p.quantity,
          }
        }),
        success_url : req.protocol + '://' + req.get('host') + '/checkout/success' ,
        cancel_url : req.protocol + '://' + req.get('host') + '/checkout/cancel' ,
        

        


      },
      {
        apiVersion: '2020-08-27', // Use a version that supports the legacy parameters
      }
      ).then(session =>{
        res.render('shop/checkout', { 
          path: '/checkout',
          pgTitle: 'CheckOut',
          products : products, 
          totalPrice : totalPrice ,
          sessionId : session.id,
        })
      })

        })

      .catch(err =>{
        console.log(err);
      })
};
