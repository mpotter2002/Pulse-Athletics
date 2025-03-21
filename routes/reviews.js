var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/reviews/
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT review_id, customer_id, product_id, rating, review_date, review_text FROM reviews";
    
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('reviews/allrecords', {allrecs: result });
        }
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/reviews/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT review_id, customer_id, product_id, rating, review_date, review_text FROM reviews WHERE review_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('reviews/onerec', {onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/reviews/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('reviews/addrec', { onerec: {} });
});
     
    
// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO reviews (customer_id, product_id, rating, review_date, review_text) VALUES (?, ?, ?, ?, ?)";
    
    const reviewDate = req.body.review_date ? new Date(req.body.review_date).toISOString().slice(0,10) : null;
    
    db.query(insertquery,[
        req.body.customer_id,
        req.body.product_id,
        req.body.rating,
        reviewDate,
        req.body.review_text
    ],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/reviews');
        }
    });
    });

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/promotions/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT review_id, customer_id, product_id, rating, review_date, review_text FROM reviews WHERE review_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('reviews/editrec', {onerec: result[0] });
        }
    });
});
    
// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE reviews SET customer_id = ?, product_id = ?, rating = ?, review_date = ?, review_text = ? WHERE review_id = ?";
    
    const reviewDate = req.body.review_date ? new Date(req.body.review_date).toISOString().slice(0,10) : null;
    
    db.query(updatequery,[
        req.body.customer_id,
        req.body.product_id,
        req.body.rating,
        reviewDate,
        req.body.review_text,
        req.body.review_id
    ],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/reviews');
        }
    });
});
    
// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM reviews WHERE review_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.redirect('/reviews');
    }
    });
    });
    
    
    
module.exports = router;