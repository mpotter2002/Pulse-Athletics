var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('reports/menu');
});

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/reports/customers/
// ==================================================
router.get('/customers', function(req, res, next) {
    let query = "SELECT customer_id, first_name, last_name, email, phone, address_1, address_2, city, state, zip FROM customers";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('reports/custlist', {allrecs: result });
    });
});

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/reports/product/
// ==================================================
router.get('/product', function(req, res, next) {
    let query = "SELECT product_id, name, description, category, price, stock, product_images, homepage FROM Products";
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        console.log("Product data:", result);
        res.render('reports/prodlist', {allrecs: result });
    });
});

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3031/reports/sales/
// ==================================================
router.get('/sales', function(req, res, next) {
    let query = `
        SELECT 
            so.order_id,
            so.customer_id,
            c.first_name,
            c.last_name,
            so.saledate,
            so.payment_status,
            od.product_id,
            p.name as product_name,
            od.quantity,
            od.saleprice
        FROM sales_order so, order_details od, customers c, Products p
        WHERE so.order_id = od.order_id 
        AND so.customer_id = c.customer_id 
        AND od.product_id = p.product_id`;
    
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.render('error');
        } else {
            res.render('reports/saleslist', {allrecs: result });
        }
    });
});

module.exports = router;