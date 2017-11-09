const passport = require('passport');
const passportConfig = require('../config/passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');

//include User model
const User = require('../models/user');


module.exports = (app)=>{

    //render login form
    app.get('/login', (req, res, next)=>{
      res.render("accounts/login", {title: 'Login', message: req.flash('loginMessage')});
    });

     //handle local-login post route
    app.post('/login',passport.authenticate('local-login',{
        successRedirect: '/courses',
        failureRedirect: '/login',
        failureFlash: true
    }));

  app.get('/register',(req, res, next)=>{
      res.render('accounts/register', {title: 'Registration', message: req.flash('signupMessage')});
  });
      
   //handle local register by posting the information to the server
  app.post('/register',passport.authenticate('local-signup',{
    successRedirect: '/courses',
    failureRedirect: '/register',
    failureFlash: true
   }));
      

   // handle profile req
   app.get('/profile', isLoggedIn,(req, res)=>{
       res.render('accounts/profile', { message: req.flash('loginMessage')});
   });
    
   app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));
   
       // handle the callback after facebook has authenticated the user
   app.get('/auth/facebook/callback',
           passport.authenticate('facebook', {
               successRedirect : '/courses',
               failureRedirect : '/'
           }));

    app.get('/connect/facebook',passport.authorize('facebook', {scope: 'email'}));     
    
    app.get('/connect/local', (req, res)=>{
        res.render('accounts/connect-local', { message: req.flash('signupMessage')});
    });

    app.post('/connect/local', passport.authenticate('local-signup',{
        successRedirect: '/courses',
        failureRedirect: '/connect/local',
        failureFlash: true
    }));

   app.get('/logout',(req, res)=>{
       req.logout();
       res.redirect('/');
   })

};

//function to verify is user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}