var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/promotions/
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT promotion_id, promotion_name, description, discount, start_date, end_date, product_id FROM promotions";
// execute query
db.query(query, (err, result) => {
if (err) {
    console.log("Error: " + err);
    res.render('error');
}
    res.render('promotions/allrecords', {allrecs: result });
});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/promotions/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT promotion_id, promotion_name, description, discount, start_date, end_date, product_id FROM promotions WHERE promotion_id = " +
    req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.render('promotions/onerec', {onerec: result[0] });
    }
    });
    });

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/promotions/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('promotions/addrec');
    });
     
    
// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO promotions (promotion_name, description, discount, start_date, end_date, product_id) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(insertquery,[
        req.body.promotion_name,
        req.body.description,
        req.body.discount,
        req.body.start_date,
        req.body.end_date,
        req.body.product_id
    ],(err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.redirect('/promotions');
    }
    });
    });

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/promotions/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT promotion_id, promotion_name, description, discount, start_date, end_date, product_id, promoimages FROM promotions WHERE promotion_id = " +
    req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log("Error: " + err);
        res.render('error');
    } else {
        res.render('promotions/editrec', {onerec: result[0] });
    }
    });
    });
    
// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE promotions SET promotion_name = ?, description = ?, discount = ?, start_date = ?, end_date = ?, product_id = ? WHERE promotion_id = " + req.body.promotion_id;
    
    db.query(updatequery,[req.body.promotion_name, req.body.description, req.body.discount, req.body.start_date, req.body.end_date, req.body.product_id],(err, result) => {
    if (err) {
        console.log("Error: " + err);
        res.render('error');
    } else {
        res.redirect('/promotions');
    }
    });
    });
    
// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM promotions WHERE promotion_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.redirect('/promotions');
    }
    });
    });
    
    
    
module.exports = router;