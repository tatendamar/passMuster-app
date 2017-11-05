const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    desc: String,
    price: Number,
    teacherModule: { type: Schema.Types.ObjectId, ref: 'User'},
    takenByStudent: [{ 
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        }],
    totalStudents: Number
});

module.exports = mongoose.model('Course', CourseSchema);