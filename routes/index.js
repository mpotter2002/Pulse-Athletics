var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var personname = "Michael Potter";
  var datevalue = Date(Date.now()).toString();

  var passdata = "My Product Catalog";

  res.render('index', { title: 'Express', personname: personname, datevalue: datevalue, passdata: passdata});
});

module.exports = router;
