var passport = require('passport');
var mongoose = require('mongoose');
var local = require('local.js');
var facebook = require('facebook.js');

module.exports = function(){
  var User = mongoose.model('User');
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    //using the find user function here as well
    //using the string makes sure that mongoose doesn't get the password as all you need for this
    //is to store the ID
    User.findOne({_id: id}, '-password', function(err, user){
      done(err, user);
    });
  });
  local();
  facebook();
};