var express = require('express');
var router = express.Router();
// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/memberships/
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT membership_type, customer_id, start_date, end_date, points FROM memberships";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        }
        res.render('memberships/allrecords', {allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/memberships/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT membership_type, customer_id, start_date, end_date, points FROM memberships WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('memberships/onerec', {onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input from end-user.
// URL: http://localhost:3031/memberships/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
    try {
        res.render('memberships/addrec', { onerec: {} });
    } catch (error) {
        console.error("Error:", error);
        res.render('error');
    }
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO memberships (membership_type, customer_id, start_date, end_date, points) VALUES (?, ?, ?, ?, ?)";
    
    // Convert dates to YYYY-MM-DD format
    const startDate = req.body.start_date ? new Date(req.body.start_date).toISOString().slice(0,10) : null;
    const endDate = req.body.end_date ? new Date(req.body.end_date).toISOString().slice(0,10) : null;
    
    db.query(insertquery,[
        req.body.membership_type,
        req.body.customer_id,
        startDate,
        endDate,
        req.body.points
    ],(err, result) => {
        if (err) {
            console.log("Error inserting membership: " + err);
            res.render('error', { errorMessage: "Failed to add membership. Please check your input." });
        } else {
            res.redirect('/memberships');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/customers/3/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT membership_type, customer_id, start_date, end_date, points FROM memberships WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log("Error: " + err);
        res.render('error');
    } else {
        res.render('memberships/editrec', {onerec: result[0] });
    }
    });
    });

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE memberships SET membership_type = ?, start_date = ?, end_date = ?, points = ? WHERE customer_id = ?";
    
    // Convert dates to YYYY-MM-DD format
    const startDate = req.body.start_date ? new Date(req.body.start_date).toISOString().slice(0,10) : null;
    const endDate = req.body.end_date ? new Date(req.body.end_date).toISOString().slice(0,10) : null;
    
    db.query(updatequery,[
        req.body.membership_type,
        startDate,
        endDate,
        req.body.points,
        req.body.customer_id
    ],(err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.redirect('/memberships');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM memberships WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.redirect('/memberships');
    }
    });
    });
    
module.exports = router;
