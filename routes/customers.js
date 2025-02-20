var express = require('express');
var router = express.Router();
// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/customers/
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip FROM customers";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('customers/allrecords', {allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/customers/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip FROM customers WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('customers/onerec', {onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/customers/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('customers/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO customers (first_name, last_name, email, phone, address_1, address_2, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(insertquery,[
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone,
        req.body.address_1,
        req.body.address_2,
        req.body.city,
        req.body.state,
        req.body.zip
    ],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.redirect('/customers');
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/customers/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip FROM customers WHERE customer_id = " +
    req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.render('customers/editrec', {onerec: result[0] });
    }
    });
    });

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ?, address_1 = ?, address_2 = ?, city = ?, state = ?, zip = ? WHERE customer_id = " + req.body.customer_id;
    
    db.query(updatequery,[req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.address_1, req.body.address_2, req.body.city, req.body.state, req.body.zip],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/customers');
    }
    });
    });

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM customers WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.redirect('/customers');
    }
    });
    });
    
module.exports = router;
