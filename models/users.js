const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


module.exports = class User{
    constructor(name , email ,password , resetToken , resetTokenExpiry ,  cart , id){    // resetToken , resetTokenExpiry  for adv authentication purposes
        this.name = name ;
        this.email = email ;
        this.password = password;
        this.resetToken = resetToken ;
        this.resetTokenExpiry = resetTokenExpiry ;
        this.cart = cart; // cart looks like {items :[]}
        this._id = id;
    };

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findbyid(userid){
        const db = getDb();
        //console.log("inside findbyid user func ....");
        return db.collection('users').findOne({_id : new mongodb.ObjectId(userid)}) 
        .then((user)=>{
            //console.log(user);
            return(user);
        })
        .catch(err =>{console.log(err);})
    }

    addToCart(product){
        const db = getDb();
        //const updatedCart = {items : [{ productId: new mongodb.ObjectId(product._id) , quantity : 1}  ]};
        
        


            //this.cart.items = [];

            console.log("inside addToCart method ...");
            // console.log(this)

            //already prod thr in cart
            const productIndex = this.cart.items.findIndex(cp =>{
                // console.log((cp.productId).toString()) ;
                // console.log((product._id).toString()) ;
                return (cp.productId).toString() === (product._id).toString() ;                
            });

            console.log(productIndex); // -1 , 0 ,    1
            
            let newQuantity = 1;
            let updatedCartItems = [...this.cart.items ];

            if(productIndex >= 0){ // already existing item in cart 
                newQuantity = this.cart.items[productIndex].quantity + 1;   //existing qty + 1
                updatedCartItems[productIndex].quantity = newQuantity ;

                console.log("qty shld be updated to...");
                console.log(newQuantity);
                console.log("...for ..." , updatedCartItems[productIndex] )
            }
            else{    //new cart item 
                updatedCartItems.push({productId: new mongodb.ObjectId(product._id) , quantity : newQuantity});
            }

            const updatedCart = { items: updatedCartItems };

            // console.log(updatedCart);

 
            return db.collection('users').updateOne( {_id : new mongodb.ObjectId(this._id)} , { $set : {cart :  updatedCart} }  )  ;//just updating the cart with updatedCart
                
        };




    getTheCart(){
        const db = getDb();
        
        const productIds = this.cart.items.map(i=>{
            return i.productId ;
        });

        return db.collection('products').find({_id : {$in : productIds}}).toArray()  // $in is just for accepting more than 1 i/p values of find()
            .then(products =>{   
                
                //* these 3 lines resets the this.cart.items ke products accordingly with what products are present in the 'products' db *
                
                // this.cart.items = this.cart.items.filter(item=>{                        
                //     return item.productId.toString() !== productIds._id.toString() ;
                // });
                
                
                return products.map(p=>{
                    return {...p , quantity : this.cart.items.find(prod =>{           //to acquire the qty of the same product from 'users' cart   
                                return (prod.productId).toString() === (p._id).toString() ;
                        }).quantity 
                    };
                })
            })
    };


    deleteProduct(id){
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(item=>{                          //filters out stuff which doesn't match the given condition
            return item.productId.toString() !== id.toString();
        });

        //updating the cart-Items

        return db.collection('users').updateOne( {_id : new mongodb.ObjectId(this._id)} , { $set : {cart :  { items : updatedCartItems }} }  )  ;//just updating the cart with updatedCart

    }


    async qtyDecrease(id) {
        const db = getDb();
    
        let updatedCartItemsQty = this.cart.items.slice();
    
        for (let i = 0; i < updatedCartItemsQty.length; i++) {
            const prod = updatedCartItemsQty[i];
    
            if (prod.productId.toString() === id.toString()) {
                prod.quantity = prod.quantity - 1;
                console.log("prod quantity is now .. ", prod.quantity);
                //console.log(prod);
    
                if (prod.quantity <= 0) {
                    await this.deleteProduct(id);
                    updatedCartItemsQty.splice(i, 1); // Removing  the item from the array
                    i--; // Adjust the loop index 
                }
            }
        }
    
        return db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: updatedCartItemsQty } } }
        );
    }
    


    addMyOrder(){
        const db = getDb();
        return this.getTheCart().then(products =>{       //(creating relational order) -> we are getting the products frm the getTheCart so that any changes in products(price etc.) shld be taken as well inside an order
            const order = {
                items : products ,
                user : { 
                    _id : new mongodb.ObjectId(this._id),
                    name : this.name
                }

            };

            return db.collection('orders').insertOne(order)
            .then(result =>{

                //emtying the users cart
                this.cart = {items : []};
                
                //emtying the users cart in db
                return db.collection('users').updateOne( {_id : new mongodb.ObjectId(this._id)} , { $set : {cart : { items : []}  } }  )  ;

            })

        })


    };

    

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({'user._id' : new mongodb.ObjectId(this._id) } ).toArray() ;
    }

}