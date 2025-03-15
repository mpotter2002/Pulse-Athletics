var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    let query = "SELECT product_id, name, product_images, category, price FROM Products WHERE description LIKE '%" + req.query.searchcriteria + "%' OR name LIKE '%" + req.query.searchcriteria + "%'";
// execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
    } 
        else {
        res.render('search', {allrecs: result});
    }
    });
});

module.exports = router;
