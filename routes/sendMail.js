var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

router.post('/', function(req, res, next) {

  var data = req.body;

  //gather mail options from body
  var mailOptions = {
    from: data.from, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    /* SCRAP
    text: data.text, // plaintext body
    html: data.html // html body
    */
    template: 'email_body',
    context: {
      bookTitle: data.info.bookTitle,
      offerAmt: data.info.offerAmt,
      bookAskingPrice: data.info.bookAskingPrice,
      bookImage: data.info.bookImage
    }
  };
  console.log(mailOptions);

  //create transporter object w/ mailgun credentials
  var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: 'omnibooks@sandboxd3dc8fa818a14352baca775bf44944f7.mailgun.org',
      pass: 'makersquare'
    }
  });

  var options = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'views/email/',
      defaultLayout: 'template',
      partialsDir: 'views/partials'
    },
    viewPath: 'views/email/',
    extName: '.hbs'
  };

  transporter.use('compile', hbs(options));

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Message sent");
      res.send("sent");
    }
  });

});

module.exports = router;
