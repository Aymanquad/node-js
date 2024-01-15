const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
// let n = 2 ;

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));           // the JSON.parse() func will convrt the JSON stuff back to js objects/values 
    }
  });
};

module.exports = class Product {
  constructor(id , title, imageUrl, description, price, userid) {                  // allows us to create new obj
    this._id = id ? new mongodb.ObjectId(id) : null ;        //if id exists i.e already existing obj create a mongoDb _id for it , otherwise null. 
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userid = userid;
  };


  save(){
    const db = getDb();
    let db_Operation;
    if(this._id){
      //Updating an already existing product here
      //console.log(this._id);
      console.log("inside updating shit");
      db_Operation = db.collection('products').updateOne({ _id : this._id} , {$set : this})     // the 2nd parameter is for wt u want to be updated ,$set basically sets all the values passed to it to be updated (in this case this i.e everything of the product)
    }
    else{
      //creating a new product
      db_Operation = db.collection('products').insertOne(this)
    }

    return db_Operation
      .then(result =>{
        console.log(result);
      })
      .catch(err =>{
        console.log(err);
      })
  };
 

  static deleteById(id){
    const db = getDb() ;
    return db.collection('products').deleteOne({ _id : new mongodb.ObjectId(id) })
      .then(product =>{
        console.log("product deleted !!");
      })

      .catch(err =>{
        console.log(err);
      });
    }
  

  static fetchAll() {
    const db = getDb() ;
    return db.collection('products').find().toArray()
              .then(products =>{
                    console.log(products);
                    return products;
               })
              .catch(err =>{
                  console.log(err);
              })
  }

  static getByid(prod_id){
    const db = getDb() ;
    return db.collection('products').find({ _id : new mongodb.ObjectId(prod_id) }).next()   // mongodb stores the id as _id which is a mongodb Object unlike our JS objects , hence we cmpare after actualy creating an obj of mongodb , .next() to go to other instances of same id object
      .then(product =>{
        console.log(product);
        return product;
      })

      .catch(err =>{
        console.log(err);
      });

  };




}

  




// ------------------------  File related stuff which we used earlier -------------------------------//

// save() {
  //   getProductsFromFile(products => { 
    
  //   if(this.id){                                                           // this if statement is used if a prod alredy exists , and we r replacing it with updated data
  //     const existingProductsIndex = products.findIndex(prod =>  (prod.id).trim() === (this.id).trim() );
  //     const updatedProducts = [...products];
  //     updatedProducts[existingProductsIndex] = this;                 // here , "this" refers to as the updated product itself( including all its new details )
      
  //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {         
  //       console.log(err);                                         
  //     });       
  //   }
  //   else{
  //   this.id = (Math.random()*10).toString();                     //To create an id whilst saving the prod
  //     products.push(this);
  //     fs.writeFile(p, JSON.stringify(products), err => {          // the JSON.stringify() func will change the js value into a JSON string
  //       console.log(err);                                          // Note: save() stores in JSON format , however the data stored in our file has to be converted back to strings for us 
  //     }); 
  //   };                                                         //        hence the conversion
  //   });
  // };



  // static fetchAll(cb) {
  //   getProductsFromFile(cb);
  // }



//   static getByid(id , cb){                                  //gives us the product details with wtever id we search 
//     getProductsFromFile(products =>{
//       const product = products.find( prod => prod.id.trim() === id.trim() );
//       cb(product);
//     });
//   }
// 

// static deleteById(id){
//   getProductsFromFile(products => {                                  
//       const product = products.find(prod => prod.id.trim() === id.trim());

//       const existingProductsIndex = products.findIndex(prod =>  (prod.id).trim() === (id).trim() );
//       products.splice(existingProductsIndex ,1);          
      
//       console.log("Muah1" , products);

//       fs.writeFile(p, JSON.stringify(products), err => {         
//         // console.log(err);  
//         Cart.deleteProduct(id ,product.price);                                       
//       });                                                     
//     })
//   }