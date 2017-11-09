const Course = require('../models/course');
const User = require('../models/user');
const keys = require('../config/keys');
const Comment = require('../models/comment');

const async = require('async');

//courses main routes

module.exports = (app)=>{

    app.get('/', (req, res, next)=>{
        res.render("main/home");
    });

    app.get('/courses', (req, res, next)=>{
        Course.find({}, (err, courses)=>{
            res.render('courses/courses', { courses: courses});
        })
    });
   
   //query the database async 
    app.get('/courses/:id', (req, res, next)=>{
        async.parallel([
            function(callback){ //callback when this function is done
    
                Course.findOne({_id: req.params.id})
                .populate('takenByStudent.user, comments.comment')
                .exec(function(err, foundCourse){
                    callback(err, foundCourse);
                });
            },
    
            function(callback){ //callback when this function is done
             User.findOne({_id: req.user._id, 'coursesTaken.course': req.params.id})
             .populate('coursesTaken.course')
             .exec((err, foundUserCourse)=>{
                 callback(err, foundUserCourse);
             });
            },           

            function(callback){ //callback when this function is done
                User.findOne({_id: req.user._id, 'coursesTeach.course': req.params.id})
                .populate('coursesTeach.course')
                .exec((err, foundUserCourse)=>{
                    callback(err, foundUserCourse);
                });
               },
        ], function(err, results){  //get results from each callback and do some logic with the results
            const course = results[0];
            const UserCourse = results[1];
            const teacherCourse = results[2];
            if(UserCourse === null && teacherCourse === null){
                res.render('courses/courseDesc',{ course: course});

            } else if(UserCourse === null && teacherCourse != null){
                res.render('courses/course', { course: course});
            } else {
                res.render('courses/course', { course: course});
            }

        });
    });
   /* app.post('/courses',(req,res)=>{
        async.waterfall([
            function(callback){
                const course = new Course();
                course.title = req.body.title;
                course.firstname = req.body.firstname;
                course.lastname = req.body.lastname;
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
                    foundUser.coursesTaken.push({ course: course._id});
                    foundUser.save((err)=>{
                        if(err)
                         return next(err);
                         res.redirect('/courses');
                    });
                });
            }
        ]);
     });*/
}