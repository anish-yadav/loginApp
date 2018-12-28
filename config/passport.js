var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/user');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

module.exports = (passport) =>  {
    //LOCAL SIGIN
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




    
  //Facebook 

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/users/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  function(token, refreshToken, refreshToken, profile, done) {
    //   console.log(profile.photos[0].value);
    //   console.log(profile._json.picture.data.url);
    User.findOne({ 'facebook.id' : profile.id}, function(err, user) {
        if (err)
            return done(err);
        if (user) {

            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.facebook.token) {
                user.facebook.token = token;
                user.facebook.username  = profile.displayName;
                user.facebook.email = '';
                user.facebook.img.src = profile.photos[0].value;
                  
                console.log('already');
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
            newUser.facebook.name  = profile.displayName;
            newUser.facebook.email = ' ';
            newUser.facebook.img.src = profile.photos[0].value;
             console.log('No');
            newUser.save(function(err) {
                if (err)
                    return done(err);
                    
                return done(null, newUser);
            });
        }
    });
  }
));

// TWITTER 
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/users/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    //   console.log(profile);
    User.findOne({ 'twitterId': profile.id }, function (err, user) {
       //Handling error
       console.log(null);
       if(err) {
           return done(err);
       }
            // if there is a user id already but no token (user was linked at one point and then removed)
            if(user != null) {
                user.twitter.token = token;
                user.twitter.username  = profile.displayName;
                user.twitter.email = '';
                user.twitter.img.src = profile.photos[0].value;
                user.save(function(err) {
                    if (err)
                        return done(err);
                    return done(null, user);
                });
                return done(null, user); // user found, return that user
            } else {
                // if there is no user, create them
                var newUser            = new User();

                newUser.twitter.id    = profile.id;
                newUser.twitter.token = token;
                newUser.twitter.name  = profile.displayName;
                newUser.twitter.email = ' ';
                newUser.twitter.img.src = profile.photos[0].value;
                console.log('No');
                newUser.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, newUser);
                });
            }
    });
  }
));

// GOOGLE 

    passport.use(new GoogleStrategy({
    consumerKey: process.env.GOOGLE_CONSUMER_KEY,
    consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: "http:/127.0.0.1:3000/users/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      User.findOne({ googleId: profile.id }, function (err, user) {
        if(err) return done(err);

        if(user != null) {
            if(!user.twitter.token){

            }
           
        } else {
            var newUser  = new User();
            newUser.google.id = profile.id;
            newUser.google.name = profile.displayName;
            newUser.google.img.src = profile.photos[0].value;
            newUser.google.token = token;
           newUser.save((err)=>{
               if(err) return done(err);

               return done(null,newUser);
           });
        }
      });
  }
));

}