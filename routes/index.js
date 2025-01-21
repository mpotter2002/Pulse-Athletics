var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var personname = "Michael Potter";

  res.render('index', { title: 'Express', personname: personname });
});

module.exports = router;
