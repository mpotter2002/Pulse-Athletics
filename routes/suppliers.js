var express = require('express');
var router = express.Router();
// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/supplier/
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT supplier_id, name, contact_name, email, phone, address FROM Suppliers";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('suppliers/allrecords', {allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/supplier/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT supplier_id, name, contact_name, email, phone, address FROM Suppliers WHERE supplier_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('suppliers/onerec', {onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/supplier/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('suppliers/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO Suppliers (name, contact_name, email, phone, address) VALUES (?, ?, ?, ?, ?)";
    
    db.query(insertquery,[
        req.body.name,
        req.body.contact_name,
        req.body.email,
        req.body.phone,
        req.body.address
    ],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.redirect('/supplier');
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/supplier/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT supplier_id, name, contact_name, email, phone, address FROM Suppliers WHERE supplier_id = " +
    req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.render('suppliers/editrec', {onerec: result[0] });
    }
    });
    });

    // ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE Suppliers SET name = ?, contact_name = ?, email = ?, phone = ?, address = ? WHERE supplier_id = " + req.body.supplier_id;
    
    db.query(updatequery,[req.body.name, req.body.contact_name, req.body.email, req.body.phone, req.body.address],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/supplier');
    }
    });
    });

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM Suppliers WHERE supplier_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.redirect('/supplier');
    }
    });
    });
    
module.exports = router;
