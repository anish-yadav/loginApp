var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Schema 
var UserSchema = new mongoose.Schema({
    username : {
        type: String ,
        unique:true,
        index: true
        
    },
    name : {
        type : String,
    },
    password: {
        type : String,
        minlength : 6
    },
    email : {
        type :String,
        unique : true
    },
   facebook : {
    id           : String,
    token        : String,
    name         : String,
    email        : String,
    img          : {
        src : String
    }
    },
    twitter : {
        id           : String,
        token        : String,
        name         : String,
        email        : String,
        img          : {
            src : String
           }
        },
        google : {
            id           : String,
            token        : String,
            name         : String,
            email        : String,
            img          : {
                src : String
               }
            }
});

var User = module.exports = mongoose.model('User', UserSchema);
User.createIndexes();

module.exports.createUser = (newUser, callback) =>{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          newUser.password = hash;
          newUser.save(callback);
        });
    });
}

User.getUserByEmail = (email, callback) =>{
    User.findOne({email},callback);
 }

User.getUserByUsername = (username, callback) =>{
   User.findOne({username},callback);
}

User.getUserById = (id, callback) =>{
        User.findById(id,callback);
 }

User.checkPassword = (userPass , hash, callback) =>{
   bcrypt.compare(userPass, hash , (err,res) =>{
     if(err) throw err;
     callback(null,res);
   });
}