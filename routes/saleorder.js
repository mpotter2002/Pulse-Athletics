var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/saleorder/
// ==================================================
router.get('/', function(req, res, next) {
    let query = `
        SELECT order_id, customer_id, saledate, payment_status FROM sales_order`;
    
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('saleorder/allrecords', {allrecs: result });
        }
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/saleorder/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT order_id, customer_id, saledate, payment_status FROM sales_order WHERE order_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            return res.render('error');
        }
        res.render('saleorder/onerec', {onerec: result[0]});
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/saleorder/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('saleorder/addrec');
});
     
// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO sales_order (customer_id, saledate, payment_status) VALUES (?, ?, ?)";
    
    const saleDate = req.body.saledate ? new Date(req.body.saledate).toISOString().slice(0,10) : null;
    
    db.query(insertquery,[
        req.body.customer_id,
        saleDate,
        req.body.payment_status
    ],(err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.redirect('/saleorder');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/saleorder/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT order_id, customer_id, saledate, payment_status FROM sales_order WHERE order_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('saleorder/editrec', {onerec: result[0] });
        }
    });
});
    
// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE sales_order SET customer_id = ?, saledate = ?, payment_status = ? WHERE order_id = ?";
    
    const saleDate = req.body.saledate ? new Date(req.body.saledate).toISOString().slice(0,10) : null;
    
    db.query(updatequery,[
        req.body.customer_id,
        saleDate,
        req.body.payment_status,
        req.body.order_id
    ],(err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.redirect('/saleorder');
        }
    });
});
    
// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    // First delete related order details
    let deleteDetailsQuery = "DELETE FROM order_details WHERE order_id = ?";
    
    db.query(deleteDetailsQuery, [req.params.recordid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            // Then delete the order
            let deleteOrderQuery = "DELETE FROM sales_order WHERE order_id = ?";
            db.query(deleteOrderQuery, [req.params.recordid], (err, result) => {
                if (err) {
                    console.log("Error: " + err);
                    res.render('error');
                } else {
                    res.redirect('/saleorder');
                }
            });
        }
    });
});

module.exports = router;