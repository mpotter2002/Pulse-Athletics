var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/reviews/
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT sale_id, customer_id, product_id, sale_date, quantity, total_price FROM sales";
    
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('sales/allrecords', {allrecs: result });
        }
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/reviews/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT sale_id, customer_id, product_id, sale_date, quantity, total_price FROM sales WHERE sale_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('sales/onerec', {onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/sales/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('sales/addrec');
    });
     
    
// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO sales (customer_id, product_id, sale_date, quantity, total_price) VALUES (?, ?, ?, ?, ?)";
    
    const saleDate = req.body.sale_date ? new Date(req.body.sale_date).toISOString().slice(0,10) : null;
    
    db.query(insertquery,[
        req.body.customer_id,
        req.body.product_id,
        saleDate,
        req.body.quantity,
        req.body.total_price
    ],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/sales');
        }
    });
    });

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/promotions/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT sale_id, customer_id, product_id, sale_date, quantity, total_price FROM sales WHERE sale_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('sales/editrec', {onerec: result[0] });
        }
    });
});
    
// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE sales SET customer_id = ?, product_id = ?, sale_date = ?, quantity = ?, total_price = ? WHERE sale_id = ?";
    
    const saleDate = req.body.sale_date ? new Date(req.body.sale_date).toISOString().slice(0,10) : null;
    
    db.query(updatequery,[
        req.body.customer_id,
        req.body.product_id,
        req.body.sale_date,
        req.body.quantity,
        req.body.total_price,
        req.body.sale_id
    ],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/sales');
        }
    });
});
    
// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM sales WHERE sale_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.redirect('/sales');
    }
    });
    });
    
    
    
module.exports = router;