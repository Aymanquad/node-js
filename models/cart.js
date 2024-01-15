// const fs = require('fs');
// const path = require('path');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'cart.json'
// );

// module.exports = class Cart {

//     static addProduct(id , productPrice){
//         fs.readFile(p, (err , fileContent) =>{
//             // fetch the prev cart
//             let cart={ products : [] , totalPrice : 0};
//             if(!err){
//                 cart = JSON.parse(fileContent);
//             }
//             // Analyze the cart , find existing product (adding it / incrementing qty if already thr )
//             const existingProductIndex =  cart.products.findIndex(i => i.id.trim() === id.trim() );
//             const existingProduct =  cart.products[existingProductIndex];
//             let updatedProduct ;
//             if(existingProduct){                             //already existing porduct
//                 updatedProduct = {...existingProduct};
//                 updatedProduct.qty = updatedProduct.qty + 1;
//                 cart.products = [...cart.products];
//                 cart.products[existingProductIndex] = updatedProduct ;
//             }
//             else{                                             // new product coming to picture
//                 updatedProduct = { id: id , qty : 1 };
//                 cart.products = [...cart.products , updatedProduct];
//             }
//             cart.totalPrice = parseFloat(cart.totalPrice)+ parseFloat(productPrice) ;
//             cart.totalPrice = Math.floor(cart.totalPrice * 100) / 100 ;
//             fs.writeFile(p , JSON.stringify(cart) , err =>{
//                 console.log(err);
//             });
//         });
//     };

//     // static deleteProduct(id ,productPrice){
//     //     fs.readFile(p, (err , fileContent) =>{
//     //         if(err){
//     //             return;
//     //         };

//     //         const updatedProducts = {...JSON.parse(fileContent)};
//     //         const product = updatedProducts.products.find(prod => prod.id.trim()===id.trim());
//     //         // console.log(product);
//     //         const x = Math.floor(parseFloat(updatedProducts.totalPrice) * 100) / 100 ;
//     //         const y = Math.floor(parseFloat(productPrice) * 100) / 100 ;

//     //         updatedProducts.totalPrice = x - (y * product.qty);
//     //         updatedProducts.totalPrice = Math.floor(updatedProducts.totalPrice * 100) / 100 ;
//     //         if(updatedProducts.totalPrice < 0 ){
//     //             updatedProducts.totalPrice = 0;
//     //         }
//     //         updatedProducts.products = updatedProducts.products.filter(prod => prod.id.trim() !== id.trim());   //filter func keeps the stuff that follows cond inside its brackets.
//     //         fs.writeFile(p , JSON.stringify(updatedProducts) , err =>{
//     //             console.log(err);
//     //         });
//     //     });
//     // };



//     static qtyUpdate(id ,qty , productPrice){
//         fs.readFile(p, (err , fileContent) =>{
//             if(err){
//                 return;
//             };

//             const updatedProducts = {...JSON.parse(fileContent)};
//             const product = updatedProducts.products.find(prod => prod.id.trim()===id.trim());
//             console.log(product.qty);
//             console.log(qty);
//             if(product.qty > 0){
//                 product.qty = product.qty - 1 ;
//                 updatedProducts.totalPrice = parseFloat(updatedProducts.totalPrice) - (parseFloat(productPrice) * product.qty);

//                 if(product.qty === 0){
//                     updatedProducts.totalPrice = parseFloat(updatedProducts.totalPrice) - (parseFloat(productPrice) * 1);
//                 }
//             }
//             updatedProducts.totalPrice = Math.floor(updatedProducts.totalPrice * 100) / 100 ;
//             if(updatedProducts.totalPrice < 0 ){
//                 updatedProducts.totalPrice = 0;
//             }

//             fs.writeFile(p , JSON.stringify(updatedProducts) , err =>{
//                 console.log(err);
//             });
//         });
//     };





//     // static getTheCart(cb){
//     //     fs.readFile(p , (err ,fileContent) =>{
//     //         if(err){
//     //             cb(null);
//     //         }
//     //         else{
//     //             cb(JSON.parse(fileContent));
                
//     //         }
//     //     });
//     // };
// }



