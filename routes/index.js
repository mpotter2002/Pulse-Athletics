var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let query = "SELECT product_id, name, product_images, category, price FROM Products WHERE homepage = true";
  // execute query
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.render('error');
    }

    let query2 = "SELECT promotion_id, promotion_name, promoimages FROM promotions WHERE start_date <= CURRENT_DATE() and end_date >= CURRENT_DATE()";
    db.query(query2, (err, result2) => {
      if (err) {
        console.log(err);
        return res.render('error');
      }
      res.render('index', {allrecs: result,promos: result2,datevalue: new Date().toISOString().slice(0,10)
      });
    });
  });
}); 

module.exports = router;
