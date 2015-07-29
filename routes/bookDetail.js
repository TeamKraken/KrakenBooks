var express = require('express');
var http = require('http');
var router = express.Router();

router.get('/', function(req, res, next) {

  console.log(req.query.book_isbn);
  var options = {
    host: 'isbndb.com',
    path: '/api/v2/json/UTUJEB5A/prices/' + req.query.book_isbn
  };

  http.get(options, function(book) {
    var bodyChunks = [];
    book.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      res.send(body);
    });
  });

});

module.exports = router;
