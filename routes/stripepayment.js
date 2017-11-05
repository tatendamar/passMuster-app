const User = require('../models/user');
const Course = require('../models/course');
const  keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const async = require('async');

module.exports = (app)=>{
 
     app.post('/payment', (req, res, next)=>{
         const stripeToken = req.body.stripeToken;
         const courseId = req.body.courseId;

         async.waterfall({
             function(callback){
              Course.findOne({_id: courseId}, (err, foundCourse)=>{
                  if(foundCourse){
                      callback(err, foundCourse);
                  }
              });
             },
             function(foundCourse, callback){
                 stripe.customers.create({
                     source: stripeToken,
                     email: req.user.email
                 }).then(function(customer){
                     return stripe.charges.create({
                      amount: foundCourse.price,
                      currency: 'usd',
                      customer: customer.id
                     }).then(function(charge){

                        async.parallel([
                            function(callback) {
                                Course.update({
                                    _id: courseId,
                                    'takenByStudent.user': {$ne: req.user._id} 
                                },
                                {
                                $push: { takenByStudent: { user: req.user._id}},
                                $inc: { totalStudents: 1}
                                }, function(err, count){
                                    if(err) return next(err);
                                    callback(err);
                                });
                            },

                            function(callback){
                                User.update(
                                    {
                                        _id: req.user._id,
                                        'coursesTaken.course': { $ne: courseId }
                                    },
                                    {
                                        $push: { coursesTaken: { course: courseId}},
                                    }, function(err, count){
                                        if(err) return next(err);
                                        callback(err);
                                    });
                            },
                            
                            function(callback){
                                User.update(
                                   {
                                       _id: foundCourse.teacherModule
                                   },
                                   {
                                    $push: { revenue: { money: foundCourse.price}},
                                   }, function(err, count){
                                       if(err) return next(err);
                                       callback(err);
                                   });
                            }
                        ], function(err, results){
                            if(err) return next(err);
                            res.redirect('/courses/' + courseId);
                        });
                     });
                 });
             }
         });
     });
}