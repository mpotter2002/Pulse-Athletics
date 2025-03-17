var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

function adminonly(req,res,next){
    if (!req.session.isadmin)
    {return res.redirect('customer/login');}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/customers/
// ==================================================
router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip, username, password FROM customers";
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
router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip, username, password FROM customers WHERE customer_id = " + req.params.recordid;
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
router.get('/addrecord', adminonly, function(req, res, next) {
    res.render('customers/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', adminonly, function(req, res, next) {
    let insertquery = "INSERT INTO customers (first_name, last_name, email, phone, address_1, address_2, city, state, zip, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) { return res.render('error'); }
            
            db.query(insertquery,[
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.phone,
                req.body.address_1,
                req.body.address_2,
                req.body.city,
                req.body.state,
                req.body.zip,
                req.body.username,
                hash  // Store the hashed password
            ],(err, result) => {
                if (err) {
                    console.log("Error: " + err);
                    res.render('error');
                }
                res.redirect('/customers');
            });
        });
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/customers/3/edit
// ==================================================
router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip, username, password FROM customers WHERE customer_id = " +
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
// Route Enable Registration
// ==================================================
router.get('/register', function(req, res, next) {
res.render('customers/addrec');
});


// ==================================================
// Route Provide Login Window
// URL: http://localhost:3031/customers/login
// ==================================================
router.get('/login', function(req, res, next) {
res.render('customers/login', {message: "Please Login"});
});

// ==================================================
// Route Check Login Credentials
// ==================================================
router.post('/login', function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, password,isadmin FROM customers WHERE username = ?";
    
    // execute query with parameterized query for security
    db.query(query, [req.body.username], (err, result) => {
        if (err) {
            console.log(err);
            return res.render('error');
        }
        
        if (result.length > 0) {
            // Username was found, check password
            bcrypt.compare(req.body.password, result[0].password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                    return res.render('error');
                }
                
                if (isMatch) {
                    // Password is correct. Set session variables for user.
                    req.session.customer_id = result[0].customer_id;
                    req.session.custname = result[0].first_name + " " + result[0].last_name;
                    req.session.isadmin = result[0].isadmin;
                    res.redirect('/');
                } else {
                    // Password doesn't match
                    res.render('customers/login', {message: "Wrong Username or Password"});
                }
            });
        } else {
            // No user found with that username
            res.render('customers/login', {message: "Wrong Username or Password"});
        }
    });
});
    
// ==================================================
// Route Check Login Credentials
// ==================================================
router.get('/logout', function(req, res, next) {
req.session.customer_id = 0;
req.session.custname = "";
req.session.cart=[];
req.session.qty=[];
res.redirect('/');
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function(req, res, next) {
    let updatequery = "UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ?, address_1 = ?, address_2 = ?, city = ?, state = ?, zip = ?, username = ?, password = ? WHERE customer_id = " + req.body.customer_id;
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
        if(err) { res.render('error');}
        
    db.query(updatequery,[req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.address_1, req.body.address_2, req.body.city, req.body.state, req.body.zip, req.body.username, hash],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/customers');
    }
    });
    });
    });
    });
   

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function(req, res, next) {
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
