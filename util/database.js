const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db ;                              // giving an _ just to keep the var only to dis pg

const mongoConnect = callback =>{ 
    
    //putting this inside a method cuz we need to access dis connection from out app.js 
    MongoClient.connect(
       `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j7u3c8z.mongodb.net/?retryWrites=true&w=majority`
        )
        .then(client =>{
            console.log("Connected");
            _db = client.db();              //connect to client
            callback(client);  
        }) 
        .catch(err =>{
            console.log(err); 
            throw err;
        })
    ; 
}

const getDb = () =>{
    if(_db){
        return _db;
    }
    else{
        console.log("No DB Found !!");
    };
};


exports.mongoConnect = mongoConnect ;
exports.getDb = getDb ;

