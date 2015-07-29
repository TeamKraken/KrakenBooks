var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('mongoose').model('user');

module.exports = function(){
  passport.use(new localStrategy(function(username, password, done){
    //findOne is built into mongoos. User is the schema created in mongo
    User.findOne({username:username}, function(err, user){
      if(err){
        return done(err);
      }
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      if(!user.authenticate(password)){
        return done(null, false, {message: 'Invalid Password'});
      }
      return done(null, user);
    });
  }));
};