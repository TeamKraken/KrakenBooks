var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var cors = require('cors');
var session = require('express-session')
/* SCRAP
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var exphbs  = require('express-handlebars');
*/

// *******************ROUTES*************************
// MongoDB routes
var bookServices = require('./routes/bookServices');
var otherServices = require('./routes/otherServices');
var userServices = require('./routes/userServices');

// Mail routes
var sendMail = require('./routes/sendMail');

// Authentication routes
var login = require('./routes/login');

// Search routes
var bookDetail = require('./routes/bookDetail');
var bookInfo = require('./routes/bookInfo');
// **************************************************


var app = express();

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// add ins for auth
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: "OurSuperSecret"
}));


app.use('/bookDetail', bookDetail);
app.use('/bookInfo', bookInfo);
app.use('/sendMail', sendMail);
app.use('/bookServices', bookServices);
app.use('/otherServices', otherServices); // handles 'other' items
app.use('/userServices', userServices);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send(err);
});

//need to set the success redirect correctly

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/market',
    failureRedirect: '/login',
    failureFlash: true })
);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/market',
    failureRedirect: '/login',
    failureFlash:true })
);

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

module.exports = app;
