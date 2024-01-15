
//this file was not requiredd !! and NEVER USED



console.log("whoooooooooooooo");


function sendValue(value , id ,  n){
    console.log("the val is :" ,value);
    value = value - 1 ;
    console.log("the new val is :" ,value);
    updateHTML(value , id , n);
}


function updateHTML(result, id , button_no) {
    const selector =  button_no ;
    selector.toString();

    const flag = document.getElementById('myFlag');
    // console.log(selector);
    const newqty = document.getElementById(selector);
  
    newqty.textContent = 'Quantity :' + '(' +result+ ')' ;
    // Cart.qtyUpdate(id , result);
    flag.value = '1';
  }




// decQtyButtons.forEach(button => {
//     button.addEventListener('click', ()=>{
//         console.log("dope hehe!");
//         // console.log("the new val is :" );
//     });
// })