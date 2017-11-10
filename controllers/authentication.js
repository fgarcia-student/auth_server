const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}

exports.signup = function(req,res,next){
  const name = req.body.name || null;
  const email = req.body.email || null;
  const ver_email = req.body.verifyEmail || null;
  const password = req.body.pw || null;
  const ver_password = req.body.verifyPw || null;
  const cellphone = req.body.cellphone || null;


  //if email or password not provided return unprocessable status and error
  if(!name || !email || !ver_email || !password || !ver_password || !cellphone) return res.status(422).json({error: 'A name,email,password, and cellphone are all required.'})
  if(email !== ver_email) return res.status(422).json({error:'Emails must match'});
  if(password !== ver_password) return res.status(422).json({error: 'Passwords must match'});
  //see if user with email exists
  User.findOne({email: email}, function(err, existingUser) {
    //if error occured, pass into callback next
    if(err) return next(err);
    //if email exists, return unprocessable status and error
    if(existingUser) return res.status(422).json({error: 'Email is in use.'});

    //if email does not exist, create and save user
    const user = new User({
      name: name,
      email: email,
      password: password,
      cellphone: cellphone,
      friends: []
    });
    user.save(function(err) {
      //after user is saved, check for errors
      if(err) return next(err);
      //if no errors, send jwt token
      res.json({token: tokenForUser(user)});
    });
  })
}

exports.signin = function(req,res,next) {
  //user has had email and pass authorized,
  //user needs token from here
  res.json({token: tokenForUser(req.user)});
}
