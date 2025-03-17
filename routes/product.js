var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin)
    {return res.redirect('customers/login');}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/product/
// ==================================================
router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT product_id, name, description, category, price, stock, product_images, homepage FROM Products";
// execute query
db.query(query, (err, result) => {
if (err) {
    console.log("Error: " + err);
    res.render('error');
}
    res.render('product/allrecords', {allrecs: result });
});
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3031/product/3/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT product_id, name, description, category, price, stock, product_images, homepage FROM Products WHERE product_id = " +
    req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.render('product/onerec', {onerec: result[0] });
    }
    });
    });

// ==================================================
// Route to show empty form to obtain input form end-user.
// URL: http://localhost:3031/product/addrecord
// ==================================================
router.get('/addrecord', adminonly, function(req, res, next) {
    res.render('product/addrec');
    });
     
    
// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', adminonly, function(req, res, next) {

    let insertquery = "INSERT INTO Products (name, product_images, description, category, price, stock, homepage) VALUES (?, ?, ?, ?, ?, ?, ?)";

    var homepage_value=0;
    if (req.body.homepage)
    {
        homepage_value = 1;
    }
    db.query(insertquery,[
        req.body.productname,
        req.body.product_images,
        req.body.description,
        req.body.category,
        req.body.price,
        req.body.stock,
        homepage_value
    ],(err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.redirect('/product');
    }
    });
    });

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3031/product/3/edit
// ==================================================
router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT product_id, name, product_images, description, category, price, stock, homepage FROM Products WHERE product_id = " +
    req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log("Error: " + err);
        res.render('error');
    } else {
        res.render('product/editrec', {onerec: result[0] });
    }
    });
    });
    
// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function(req, res, next) {
    let updatequery = "UPDATE Products SET name = ?, product_images = ?, description = ?, category = ?, price = ?, stock = ?, homepage = ? WHERE product_id = " + req.body.product_id;
    
    var homepage_value=0;
    if (req.body.homepage)
    {
    homepage_value = 1;
    }

    db.query(updatequery,[req.body.productname, req.body.prodimage, req.body.description, req.body.category, req.body.price, req.body.stock, homepage_value],(err, result) => {
    if (err) {
        console.log("Error: " + err);
        res.render('error');
    } else {
        res.redirect('/product');
    }
    });
    });
    
// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM Products WHERE product_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log("Error: " + err);
    res.render('error');
    } else {
    res.redirect('/product');
    }
    });
    });
    
    
    
module.exports = router;
