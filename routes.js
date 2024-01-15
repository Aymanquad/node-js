// const fs = require('fs');

// const reqHandler = (req, res ) =>{
//     // console.log(req);
//     // res.setHeader('Content-Type' , 'text/html');
//     const url = req.url ;
//     const method = req.method;
//     if(url === '/'){
//         res.write('<html>');
//         res.write('<head><title> Habibi </title></head>');
//         res.write('<body> <form action="/msg" method="POST"> <input type="text" name="message" > <button type="submit">SEND</button> </form>   </body>');
//         res.write('</html>');
//         return res.end();
//     }
//     if(url === '/msg' && method=== "POST"){
//         const body = [];
//         req.on('data' , (chunks)=>{
//             console.log(chunks);                               
//             body.push(chunks);                                   // storing the i/p data in chunks
//         });

//         return req.on('end' , ()=>{
//             const parseddata = Buffer.concat(body).toString().split('=')[1];     //using the buffer obj and joining the above chunks 
//             console.log(parseddata);
//             fs.writeFile("rcvdmsg.txt" , parseddata , e =>{
//                 res.statusCode = 302;                                   // the redirecting code number
//                 res.setHeader('Location' , '/');                        // back to the form pg
//                 return res.end();
//             });
//         })

        
//     }

//     console.log('lmaooo');
//     res.setHeader('Content-Type' , 'text/html');
//     res.write('<html>');
//     res.write('<head><title> Habibi </title></head>');
//     res.write('<body> <h1> Hello from node js bro </h1></body>');
//     res.write('</html>');
//     res.end();
// };


// module.exports = reqHandler;