var passport = require('passport');
var url = require('url');
var FacebookStrategy = require('passport-facebook').Strategy;
var users = require(/* wherever we create new users*/);
var facebookCreds = require('../config.js');


module.exports = function(){
  passport.use(new FacebookStrategy({
      clientID: facebookCreds.clientID,
      clientSecret: facebookCreds.clientSecret,
      callbackURL: facebookCreds.callbackURL,
      passReqToCallback: false
    },
    function(req, accessToken, refreshToken, profile, done) {
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      var providerUserProfile = {
        name: profile.name.givenName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'facebook',
        providerId: profile.id,
        providerData: providerData
      };
      //this is calling a function on saving the user information - needs to be made
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};