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


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username,(err,user)=>{
            if (err) throw err;
            if(!user) {
                return done(null,false,{message:"unknown user"});
            }
            User.checkPassword(password,user.password,(err,match)=>{
                if (err) throw err;
                if (match) {
                    return done(null,user);
                } else {
                    return done(null,false,{message:"Invalid Password"});
                }
            });


        });
    }
  ));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });
router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login', failureFlash:true}),
  function(req, res) {
   
    res.redirect('/');
  });


  //Facebook

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        if (err)
            return done(err);

        if (user) {

            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.facebook.token) {
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });
            }

            return done(null, user); // user found, return that user
        } else {
            // if there is no user, create them
            var newUser            = new User();

            newUser.facebook.id    = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function(err) {
                if (err)
                    return done(err);
                    
                return done(null, newUser);
            });
        }
    });
  }
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


  router.get('/logout',(req,res) =>{
     req.logout();

     req.flash('success_msg',' You are successfully logged out');
     res.redirect('/users/login');
  }
  )
module.exports = router;