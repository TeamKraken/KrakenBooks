var util = require('util'),
    OperationHelper = require('apac').OperationHelper;
var express = require('express');
var http = require('http');
var router = express.Router();
var configs = require('../config.js');

router.get('/', function(req, res, next) {
  console.log('req.query.SearchIndex',req.query.SearchIndex);
  console.log('req.query.Keywords', req.query.Keywords);

var opHelper = new OperationHelper({
    awsId:     configs.awsId,
    awsSecret: configs.awsSecret,
    assocId:   'cartchun-20',
    // xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
    version:   '2013-08-01'
    // your version of using product advertising api, default: 2013-08-01
});


// execute(operation, params, callback)
// operation: select from http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SummaryofA2SOperations.html
// params: parameters for operation (optional)
// callback(err, parsed, raw): callback function handling results. err = potential errors raised from xml2js.parseString() or http.request(). parsed = xml2js parsed response. raw = raw xml response.

opHelper.execute('ItemSearch', {
  'SearchIndex': req.query.SearchIndex,
  'Keywords': req.query.Keywords,
  'ResponseGroup': 'ItemAttributes,Images'
}, function(err, results) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
    console.log(results);
    res.send(results);
});


});

module.exports = router;