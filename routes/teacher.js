const User = require('../models/user');
const Course = require('../models/course');

var async = require('async');

module.exports = (app)=>{

//route for using the become-an-instructor 
    app.route('/become-an-instructor')

    .get((req, res, next)=>{
      res.render('teacher/become-instructor');
    })

    .post((req, res, next)=>{
           
       async.waterfall([
           function(callback){
               const course = new Course();
               course.title = req.body.title;
               course.username = req.body.username
               course.desc = req.body.desc;
               course.address = req.body.address;
               course.city = req.body.city;
               course.area = req.body.area;
               course.mobile = req.body.mobile;
               course.level = req.body.level;

               course.save((err)=>{
                   callback(err, course);
               });

           },

           function(course, callback){
               User.findOne({_id: req.user._id}, (err, foundUser)=>{
                   foundUser.role = "teacher";
                   foundUser.coursesTeach.push({ course: course._id});
                   foundUser.save((err)=>{
                       if(err)
                        return next(err);
                        res.redirect('/teacher/dashboard');
                   });
               });
           }
       ]);
    });

    //get the courses attributes from the user model for a particular user that has registered for to be a tutor and populate course
    app.get('/teacher/dashboard', (req, res, next)=>{
        User.findOne({_id: req.user._id})
        .populate('coursesTeach.course')
        .exec((err, foundUser)=>{
            res.render('teacher/teacher-dashboard', {foundUser: foundUser});

        });
    });

//revenue report route
    app.get('/revenue-report', (req, res)=>{
        var revenue = 0;
        User.findOne({_id: req.user._id}, (err, foundUser)=>{
            foundUser.revenue.forEach(function(value){
               revenue += value; 
            });
            res.render('teacher/revenue-report', {revenue: revenue})
        });
    });
}



