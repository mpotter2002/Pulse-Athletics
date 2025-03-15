var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all order details
// URL: http://localhost:3031/orderdetails
// ==================================================
router.get('/', function(req, res, next) {
    let query = `
        SELECT 
            orderdetail_id,
            order_id,
            product_id,
            quantity,
            saleprice
        FROM order_details`;
    
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('orderdetails/allrecords', {
                allrecs: result,
                order_id: null
            });
        }
    });
});

// ==================================================
// Route to list all records for a specific order
// URL: http://localhost:3031/orderdetails/order/:orderid
// ==================================================
router.get('/order/:orderid', function(req, res, next) {
    let query = `
        SELECT 
            orderdetail_id,
            order_id,
            product_id,
            quantity,
            saleprice
        FROM order_details
        WHERE order_id = ?`;
    
    db.query(query, [req.params.orderid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('orderdetails/allrecords', {
                allrecs: result,
                order_id: req.params.orderid
            });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/orderdetails/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    // Get products list for dropdown
    let query = "SELECT product_id, name, price FROM Products";
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('orderdetails/addrec', {
                order_id: req.params.orderid === 'new' ? '' : req.params.orderid,
                products: result
            });
        }
    });
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO order_details (order_id, product_id, quantity, saleprice) VALUES (?, ?, ?, ?)";
    
    db.query(insertquery,[
        req.body.order_id,
        req.body.product_id,
        req.body.quantity,
        req.body.saleprice
    ],(err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.redirect('/orderdetails');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/orderdetails/:recordid/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT * FROM order_details WHERE orderdetail_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('orderdetails/editrec', {
                onerec: result[0]
            });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE order_details SET product_id = ?, quantity = ?, saleprice = ? WHERE orderdetail_id = ?";
    
    db.query(updatequery,[
        req.body.product_id,
        req.body.quantity,
        req.body.saleprice,
        req.body.orderdetail_id
    ],(err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.redirect('/orderdetails');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete/:orderid', function(req, res, next) {
    let query = "DELETE FROM order_details WHERE orderdetail_id = ?";
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.redirect('/orderdetails');
        }
    });
});

// ==================================================
// Route to view one specific record.
// URL: http://localhost:3031/orderdetails/:recordid/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = `SELECT od.*, p.name as product_name FROM order_details od, Products p WHERE od.orderdetail_id = ? AND od.product_id = p.product_id`;
    
    db.query(query, [req.params.recordid], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('orderdetails/onerec', { onerec: result[0] });
        }
    });
});

module.exports = router; 