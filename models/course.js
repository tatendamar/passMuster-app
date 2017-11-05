const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    desc: String,
    price: Number,
    OwnByTeacher: { type: Schema.Types.ObjectId, ref: 'User'},
    OwnByStudent: [{ 
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        }],
    totalStudents: Number
});

module.exports = mongoose.model('Course', CourseSchema);