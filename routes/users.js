var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../model/user');
//Register
router.get('/register',(req,res)=>{
    res.render('register');
});

//signin
router.get('/login',(req,res)=>{
    res.render('login');
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
    req.checkBody('password','Must be more than 6 characters').isLength({min:6});
     req.checkBody('password2','Password must match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
         res.render('register',{errors});
    } else {
        //checking for email and username are already taken or not
		User.findOne({ 'local.username': { 
                            "$regex": "^" + username + "\\b", "$options": "i"
                    }}, function (err, user) {
                            User.findOne({ 'local.email': { 
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
                                           value:user.local.username
                                    }];
                                        res.render('register', {errors})
                                    }
                                }
                                else {
                                    var newUser = new User();
                                    newUser.local.name = name;
                                    newUser.local.username = username ;
                                    newUser.local.password = password;
                                    newUser.local.email  = email;
                                    User.createUser(newUser, function (err, user) {
                                        if (err) throw err;
                                    });
                                     req.flash('success_msg', 'You are registered . Can login now');
                                    res.redirect('/users/login');
                                }
                            });
                        });
	}
});

require('../config/passport')(passport);


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