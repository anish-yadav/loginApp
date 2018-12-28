var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../model/user');
//Register
router.get('/register',(req,res)=>{
    res.render('register');
});

//signin
router.get('/login',(req,res)=>{
    res.render('Login');
});

//Register new user
router.post('/register',(req,res)=>{
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    //Validate the form
    req.checkBody('name','Please enter a name').notEmpty();
    req.checkBody('username','Please enter a username').notEmpty();
    req.checkBody('email','Please enter an email').notEmpty();
    req.checkBody('email','Please enter a valid email').isEmail();
    req.checkBody('password','A password must be set').notEmpty();
     console.log(password2+"  " + password);
     req.checkBody('password2','Password must match').equals(req.body.password);
    var errors = req.validationErrors();
    
    if (errors) {
         res.render('register',{errors});
    } else {
        //checking for email and username are already taken
		User.findOne({ username: { 
                            "$regex": "^" + username + "\\b", "$options": "i"
                    }}, function (err, user) {
                            User.findOne({ email: { 
                                "$regex": "^" + email + "\\b", "$options": "i"
                        }}, function (err, mail) {
                                if (user || mail) {
                                    if ( mail) {
                                        var errors = [{
                                            param: "email",
                                            msg:"Email already taken",
                                           value:email
                                    }];
                                        res.render('register', {errors})
                                    }
                                    if (user) {
                                        var errors = [{
                                            param: "username",
                                            msg:"Username already taken",
                                           value:user.username
                                    }];
                                        res.render('register', {errors})
                                    }
                                }
                                else {
                                    var newUser = new User({name,email,username,password});
                                    User.createUser(newUser, function (err, user) {
                                        if (err) throw err;
                                        console.log(user);
                                    });
                                     req.flash('success_msg', 'You are registered . Can login now');
                                    res.redirect('/users/login');
                                }
                            });
                        });
	}
});

require('../config/passport')(passport);


// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         User.getUserByUsername(username,(err,user)=>{
//             if (err) throw err;
//             if(!user) {
//                 return done(null,false,{message:"unknown user"});
//             }
//             User.checkPassword(password,user.password,(err,match)=>{
//                 if (err) throw err;
//                 if (match) {
//                     return done(null,user);
//                 } else {
//                     return done(null,false,{message:"Invalid Password"});
//                 }
//             });


//         });
//     }
//   ));


//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
  
//   passport.deserializeUser(function(id, done) {
//     User.getUserById(id, function(err, user) {
//       done(err, user);
//     });
//   });
router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login', failureFlash:true}),
  function(req, res) {
   
    res.redirect('/');
  });


//   //Facebook


router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


    router.get('/twitter',
    passport.authenticate('twitter'));

    router.get('/twitter/callback', 
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
        });


  router.get('/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

  router.get('/logout',(req,res) =>{
     req.logout();

     req.flash('success_msg',' You are successfully logged out');
     res.redirect('/users/login');
  }
  )
module.exports = router;