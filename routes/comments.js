const Course = require('../models/course');
const Comment = require('../models/comment');
var async = require('async');

module.exports = (app)=>{

 app.get('/courses/:id/comments/new', (req, res)=>{
     //find course by id
   
     Course.findOne({_id: req.params.id}, (err, course)=>{
         if(err){
         console.log(err);
         } else {
            res.render('comments/new', {course: course});
         }
     })
     
 });


 app.post('/courses/:id/comments',(req, res)=>{
    Course.findOne({_id: req.params.id}, (err, course)=>{
        if(err){
            console.log(err)
            res.redirect('/courses');
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                  if(err){
                      console.log(err)
                  } else {
                      course.comments.push(comment);
                      course.save();
                      res.redirect('/courses/' + course._id);
                  }
            })
        }
    })
  })
  } 
