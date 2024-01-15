// const { use } = require("../routes/admin");
const User = require('../models/users');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');  //using this email service to notify the newly logged in user in their mail
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { get, use } = require('../routes/admin');



const transporter = nodemailer.createTransport(sendgridTransport({
  auth :{
    api_key : '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'
  }
}));


exports.getLogin = (req, res, next) => {
  // const loggedIn = (req.get('Cookie').trim().split('=')[1]) === "true";
  // console.log(res.session);

  let errmsg = req.flash('error') ;   //flash key is called
  let pswderrmsg = req.flash('pwsderr');
  if(errmsg.length > 0){
    errmsg = errmsg[0];
  }
  else{
    errmsg = null;
  }

  if(pswderrmsg.length > 0){
    console.log("pswd err exists...")
    pswderrmsg = pswderrmsg[0];
  }
  else{
    pswderrmsg = null;
  }

  res.render('auth/login', {
    path: '/login',
    pgTitle: 'Login',
    errorMsg : errmsg ,  
    pswderrMsg : pswderrmsg ,
  });
};


exports.postLogin = (req, res, next) => {

  const db = getDb();
  const email = req.body.email ;
  const password =  req.body.password;
  
  db.collection('users').findOne({email : email})
    .then(user=>{
      if(!user){
        req.flash('error','Invalid email or password ...');   //'error' acts as a key so that we can invoke a flash msg whenever called using the key
        return res.redirect('/login');
      }

      bcrypt.compare(password , user.password)  //comparing written pswd to existing user password which is hashed 
        .then(doMatch =>{
          if(doMatch){
            req.session.loggedIn = true;
            req.session.user = new User(user.name , user.email , user.password , user.resetToken , user.resetTokenExpiry ,  user.cart ,user._id) ; // new user is created and passed frm here in order to access to access functions inside it ovr there(admin)
            return req.session.save(err =>{console.log(err) ; res.redirect('/')})
            //res.redirect('/');
          }

          //don't match 
          req.flash('pswderr','Invalid password.');
          return res.redirect('/login');
        })
        .catch(err=>{
          console.log(err);
          res.redirect('/login');
        })
    })
  
    
  //sending a cookie value from here...
  //res.setHeader('Set-Cookie' , 'loggedIn=true');

};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) =>{
    console.log(err);
     res.redirect('/');
  })
};

exports.getSignUp  = (req, res, next) => {

  let errmsg = req.flash('err') ;   
  if(errmsg.length > 0){
    errmsg = errmsg[0];
  }
  else{
    errmsg = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pgTitle: 'Sign-Up',
    errorMsg : errmsg,
  });
}


exports.postSignUp  = (req, res, next) => {
  const name = req.body.name ;
  const email = req.body.email ;
  const password = req.body.password ;
  const confirm_password = req.body.confirmPassword;


  const db = getDb();
  db.collection('users').findOne({email : email})
    .then(userDoc=>{
      if(userDoc){
        req.flash('err', 'User with this email already exists.');
        return res.redirect('/signup');
      }

      return bcrypt.hash(password , 12 ) //12 is the default (secure) strength on hashing passwords
      .then(hashedpassword =>{

        const user = new User(name , email , hashedpassword , null , null ,  {items:[]} , null);
        return user.save()
          

      }).then(result =>{
        res.redirect('/login');
          return transporter.sendMail({
            to : email ,
            from : 'mohammedaymanquadri@gmail.com',
            subject : "Sign In Succeeded !",
            html : '<h1>You Successfully signed In </h1>'
          })
        })
        .catch(err=>{
          console.log(err); 
        })
      })

    .catch(err=>{
      console.log(err);
    })
}


exports.getReset = (req ,res, next) =>{
  let errmsg = req.flash('err1') ;   
  if(errmsg.length > 0){
    errmsg = errmsg[0];
  }
  else{
    errmsg = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pgTitle: 'Reset Password',
    errorMsg : errmsg,
  });
}


exports.postReset = (req ,res, next) =>{
  const db = getDb() ;
  crypto.randomBytes(32 , (err , buffer) =>{   //32 bytes of a token
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');    // assigning them back to ascii from hex
    db.collection('users').findOne({email : req.body.email})
      .then(user =>{
        if(!user){
          req.flash('err1','User for the provided email does not exist !');
          return res.redirect('/reset');
        }

        //user is found with that email
        // user.resetToken = token;
        // user.resetTokenExpiry = Date.now() + 3600000 ;    // 3600000ms is 1 hr
        console.log(token);
        db.collection('users').updateOne({email : req.body.email} , {$set : { resetToken : token , resetTokenExpiry : Date.now() + 3600000  }})
      })
      .then(result =>{
          transporter.sendMail({
            to : req.body.email ,
            from : 'mohammedaymanquadri@gmail.com',
            subject : "Password Reset !",
            html : `
                  <p> You requested a password Reset ? </p>
                  <p> If yes click the following link.... <a href='http://localhost:3000/reset/${token}'>Link</a>  </p>
            `  // chatgpt why this token aint same as above token 
          });
          res.redirect('/login')
        })
      .catch(err=>{
        console.log(err);
      })
  })
};


exports.getNewPassword =(req ,res , next) =>{
  const db = getDb();
  const token = req.params.token ;
  db.collection('users').findOne({resetToken :  token  , resetTokenExpiry : {$gt : Date.now()}})
    .then(user=>{
      let errmsg = req.flash('err1') ;   
      if(errmsg.length > 0){ 
        errmsg = errmsg[0];
      }
      else{
        errmsg = null;
      }

      console.log(user);
      res.render('auth/new-password', {
        path: '/new-password',
        pgTitle: 'New Password',
        errorMsg : errmsg,
        userId : user._id.toString(),
        passwordToken : token,
      });
    })
    .catch(err=>{
      console.log(err);
    })
};


exports.postNewPassword = (req ,res ,next ) =>{
  const db = getDb();

  const userid = req.body.userId;
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  console.log(userid);

  db.collection('users').findOne({resetToken :  passwordToken  , resetTokenExpiry : {$gt : Date.now()} , _id : userid})
    .then(user=>{
      resetUser = user;
      return bcrypt.hash(newPassword , 12 ) 
    })
    .then(hashedpassword=>{
      db.collection('users').updateOne({_id : new mongodb.ObjectId(userid) } , {$set : { password : hashedpassword , resetToken : undefined , resetTokenExpiry : undefined }})
    })
    .then(result =>{
      res.redirect('/login');
    })
    .catch(err=>{
      console.log(err);
    })

}
