const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title:     String,
    username:  String,
    address:   String,
    mobile:    String,
    level:     String,
    years:     String,
    city:      String,
    area:      String,
    desc:      String,
    price:     Number,
    firstname: String,
    lastname:  String,
    
    teacherModule: 
              {
         type: Schema.Types.ObjectId, ref: 'User'
              },
    takenByStudent: [
        { 
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        }],
    comments: [
        {
       comment:{type: Schema.Types.ObjectId, ref: 'Comment'},

    }],
    totalStudents: Number
});

module.exports = mongoose.model('Course', CourseSchema);