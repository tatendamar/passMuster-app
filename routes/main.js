const Course = require('../models/course');
const User = require('../models/user');

const async = require('async');



module.exports = (app)=>{

    app.get('/', (req, res, next)=>{
        res.render("main/home");
    });

    app.get('/courses', (req, res, next)=>{
        Course.find({}, (err, courses)=>{
            res.render('courses/courses', { courses: courses});
        })
    });

    app.get('/courses/:id', (req, res, next)=>{
        async.parallel([
            function(callback){
               

                Course.findOne({_id: req.params.id})
                .populate('OwnByStudent.user')
                .exec(function(err, foundCourse){
                    callback(err, foundCourse);
                });
            },

            function(callback){
             User.findOne({_id: req.user._id, 'coursesTaken.course': req.params.id})
             .populate('coursesTaken.course')
             .exec((err, foundUserCourse)=>{
                 callback(err, foundUserCourse);
             });
            },

            function(callback){
                User.findOne({_id: req.user._id, 'coursesTeach.course': req.params.id})
                .populate('coursesTeach.course')
                .exec((err, foundUserCourse)=>{
                    callback(err, foundUserCourse);
                });
               },
        ], function(err, results){
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
    
}