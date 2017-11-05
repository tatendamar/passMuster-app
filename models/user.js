const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema =  new Schema({
  local:{
    email: { 
        type: String,
         unique: true, 
         lowercase: true
        },
    password: {
         type: String
        }
        
  },
   facebook: {
       id: String,
       token: String,
       email:  String,
       name: String
   },

   role: String,

   coursesTeach: [{
       course: { type: Schema.Types.ObjectId, ref: 'Course'}
   }],

   coursesTaken: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
}],

  revenue: [{
      money: Number
  }],

});

UserSchema.methods.generateHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);