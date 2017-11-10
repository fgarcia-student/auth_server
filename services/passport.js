const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');


//create local Strategy
const localOptions = {usernameField: 'email', passwordField: 'pw'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  //verify email and password, call done if valid credentials with user
  //otherwise, call done with false
  User.findOne({email: email}, function(err,user) {
    //if error in db
    if(err) return done(err);
    //if no user found in db
    if(!user) return done(null,false);

    //compare passwords
    user.comparePassword(password, function(err, isMatch) {
      if(err) return done(err); //if error, bubble error
      if(!isMatch) return done(null, false); //if passwords do not match
      return done(null, user); //user and pw matched
    })
  })
})

//setup options for JWT Strategy
const jwtOptions = {
  //check for token on authorization in header of req
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  //secret key
  secretOrKey: config.secret
};

//create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload,done) {
  //see if the user ID in payload exists in our db
  //if yes, call done with user from db search
  //otherwise, call done w/out user
  User.findById(payload.sub, function(err,user) {
    if(err) return done(err, false); // done takes 2 args error object[1] and user[2]
    if(user) done(null, user); //call done with user
    else done(null, false);
  })
});

//tell passport to use Strategy
passport.use(jwtLogin);
passport.use(localLogin);
