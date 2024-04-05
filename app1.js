// const route = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const csrf = require('csurf');                         // to use csrf(cross site response forgery) tokens to provide security to users
const flash = require('connect-flash');
// const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);  //this is a func

const errorController = require('./controllers/error');     //accesing error controller
const mongoConnnect = require('./util/database').mongoConnect;


const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/autherization');


const User = require('./models/users');

const express = require('express');            //    for adding express stuff
const csurf = require('csurf');
const { mongoConnect } = require('./util/database');

const app = express();                          //
const csrfProtection = csurf();

app.set('view engine' , 'ejs');            //telling express that we r using the template engine on pug/ejs files
app.set('views' , 'views');               // we using the view function on 'views' folder


app.use(
    cors({
      origin: ["http://localhost:3000", "https://online-shop-fryr.onrender.com"],
    })
  );

const store = new MongoDBStore({
    uri : `mongodb+srv://mohammedaymanquadri:Ayman2004@cluster0.j7u3c8z.mongodb.net/` ,   // ur mongodb url
    collection : "sessions"   // collection name 
})

// app.use(helmet());

app.use(bodyParser.urlencoded({extended:false}));          // parses the input info for us using the external middleware func , Bodyparser.
app.use(express.static(path.join(__dirname , 'public')));   // to access the 'public' folder throu express statically (elsewise , it can't access it)
app.use(
    session({ secret: 'my secret' , resave: false , saveUninitialized : false , store : store }) // resave and saveUninitialized are kept false in order to improve efficiency and provide more security as it does not change with every req change . 
)
app.use(csrfProtection);
app.use(flash());

app.use((req , res , next) =>{
    res.locals.isAuthenticated = req.session.loggedIn ;  //basically locals is a way of telling express to include this code for all the render view pages
    res.locals.csrfToken = req.csrfToken() ;             //doing this for the csrf token which will generate and look for a name="_csrf" in our views to assign it a csrf_token 
    next();
})


app.use((req , res , next) =>{
    if(!req.session.user){
        return next();
    }

    User.findbyid(req.session.user._id)
    .then(user =>{
        console.log("Found user  ...")
        req.session.user = new User(user.name , user.email , user.password , user.resetToken , user.resetTokenExpiry ,  user.cart ,user._id) ; // new user is created and passed frm here in order to access to access functions inside it ovr there(admin)
        // console.log("user  is ..." , user);
        next();
    })
    .catch(err =>{
        console.log(err);
    })
})

app.use(adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.use(errorController.get404);

// app.listen(3000);  

mongoConnnect( ()=>{
    //console.log(process.env.MONGO_USER);
    app.listen(3000);
});

// mongoConnect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j7u3c8z.mongodb.net/?retryWrites=true&w=majority`)
//     .then(() => {
//         console.log('Connected to MongoDB !'); 
//         app.listen(3000);
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });






//----mongoose notes----//

//connection part = require mongoose package , and do mongoose.connect('url_link').then(res=>{ app.listen(3000); }).catch(err)

// mongoose stores data using schemas which act like a blueprint . it can be made (required : true) or not depending on ur requirements.


//Note : mongoose directly stores the ids as Objects after verifying in em so that u don't have to do .. new mongodb.ObjectId(id).   :)

// .save() = Used to save the products directly to db 
// .find() = without any parameters gives us all the products present inside it , with parameters it fetches the products which match the given condition    ( Alternate for fetchAll() ) 
//.findById() = finds documents/products with given id . (alternate for findOne())
// .findByIdAndRemove() = as the name suggests -_- .
 
// in a Schema , u could have ... userId : { type : Schema.Types.ObjectId ,  ref : 'Users'  , required : true } 
//                                         ^(type must be of a form of Schema Obj)    ^( references an Obj of my 'Users' model ) .


// other functions such as .select() and .populate() can be used , And are veryy handy...
//      .select( title price -description ) --> so this code basically keeps only the title , price and excludes description .
//      .populate( 'user_id' , '' '' ) --> the initial code only retreived the <obj id> of 'user_id' object . But using the .populate( '<model_name' ) spreads/extracts all of the object inside it . specific instances can also be written after it using a coma . 


// Instance methods =>  We can just use UserSchema.methods.<func_name> = function(){ ... }  to basically update/tweak the stuff present in our user schema .
//                                                  ^(key)


// Sometimes....  The .populate() method returns a query string and .then() can't be used on it , so we can do .populate(...).execPopulate() to return a promise .
// execPopulate() is particularly useful when you have multiple levels of nesting or when you want to control the population settings at different stages of your code .


//  ._doc property is used to access the raw JavaScript object representation of a Mongoose document without any additional Mongoose-related properties to it .



