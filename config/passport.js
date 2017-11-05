const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');
const configAuth = require('./auth');


module.exports = (passport)=>{

    //using session
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField:  'email',
        passwordField:   'password',
        passReqToCallback: true
    },
    function(req, email, password,done){
        process.nextTick(()=>{
            //async
            User.findOne({'local.email' : email},(err, user)=>{
                if(err)
                return done(err);
                if(user){
            
                    return done(null, false, req.flash('signupMessage', 'Email already teken')); 
                } 
                 if(!req.user) {
                    const newUser = new User();
                    newUser.local.email =  email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save((err)=>{
                          if(err)
                            throw err;
                            return done(null, newUser);
                    });
                } else {
                   const user =  req.user;
                   user.local.username = email;
                   user.local.password = user.generateHash(password);

                   user.save((err)=>{
                       if(err)
                        throw err;
                        return done(null, user);
                   })
                }
            });
        });
    }
));
     
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  },
  function(req, email,password, done){
      process.nextTick(()=>{
          User.findOne({ 'local.email': email},(err, user)=>{

              // if there is an error, stop everything and return that
           // ie an error connecting to the database
              if(err)
              return done(err);

               // if the user is ot found, then show login error
              if(!user)
              return done (null, false, req.flash('loginMessage', 'No user found'));
             
              //if passwords do not match 
              if(!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
              }
              req.flash('loginMessage', 'Successfully logged in');
                return done(null,  user);
      
          });
      });
  }
 ));

 passport.use(new FacebookStrategy({
    
            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields   : ['id', 'name', 'email'],
            passReqToCallback: true
    
        }, 
 function(req, token, refreshToken, profile, done) {
            
    // asynchronous
   process.nextTick(function() {
   //user is not logged in yet
      if(!req.user){

        // find the user in the database based on their facebook id
           User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                            
           // if there is an error, stop everything and return that
           // ie an error connecting to the database
           if (err)
              return done(err);
                            
         // if the user is found, then log them in
                if (user) {
                    req.flash('loginMessage', 'Successfully logged in with facebook');
                  return done(null, user); // user found, return that user
                   } else {
          // if there is no user found with that facebook id, create them
                const newUser            = new User();
                
                newUser.facebook.id    = profile.id; // set the users facebook id                   
                newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                            
        // save our user to the database
                   newUser.save(function(err) {
                      if (err)
                       throw err;
                            
      // if successful, return the new user
                     return done(null, newUser);
                        });
                 console.log(profile);
                      }
                   });

                 }
        //user is logged already
             else {
              const user          = req.user;
              user.facebook.id    = profile.id;
              user.facebook.token = token;
              user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = profile.emails[0].vlaue;

              user.save((err)=>{
                  if(err)
                   throw err;
                  return done (null, user);
              });
           }
                       
         });
            
    }));
 };