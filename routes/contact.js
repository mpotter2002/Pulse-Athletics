var express = require('express');
var router = express.Router();
/* GET about page. */
router.get('/', function(req, res, next) {
res.render('contact', { title: 'Contact Pulse Athletics' });
});


module.exports = router;