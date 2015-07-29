var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

router.post('/', function (req, res, next){

  passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }

      // TODO do something upon authentication
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/users/' + user.username);
      });
    })(req, res, next);
});

module.exports = router;
