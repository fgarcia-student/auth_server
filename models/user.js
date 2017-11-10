const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//define our model
const userSchema = new Schema({
  name: String,
  email: {type: String, unique: true, lowercase: true},
  password: String,
  cellphone: String,
  friends: [String]
});

//On Save Hook, encrypt password
//before saving a model, run function
userSchema.pre('save', function(next) {
  const user = this;
  //generate a salt then run cb
  bcrypt.genSalt(10, function(err,salt) {
    if(err) return next(err);
    //hash our password using salt then run cb
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) return next(err);
      //overwrite plain text pw with hash
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err); //if error , pass it along to callback
    cb(null, isMatch); //otherwise, call callback with isMatch
  })
}

//create model class
const ModelClass = mongoose.model('user', userSchema);

//export model
module.exports = ModelClass;
