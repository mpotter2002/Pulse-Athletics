var express = require('express');
var router = express.Router();
// ==================================================
// Route to list all products on the catalog
// ==================================================
router.get('/', function(req, res, next) {
let query = "SELECT product_id, name, product_images, category, price FROM Products";
// execute query
db.query(query, (err, result) => {
if (err) {
    console.log(err);
    return res.render('error');
}

    res.render('catalog', {allrecs: result });
});
});

// ==================================================
// Route to add an item to the cart
// ==================================================
router.post('/add', function(req, res, next) {
    if (typeof req.session.cart !== 'undefined' && req.session.cart ) {
    if (req.session.cart.includes(req.body.product_id))
    {
    // Item Exists in Basket - Increase Quantity
        var n = req.session.cart.indexOf(req.body.product_id);
        req.session.qty[n] = parseInt(req.session.qty[n]) +
        parseInt(req.body.qty);
    }
    else
    {
    // Item Being Added First Time
        req.session.cart.push(req.body.product_id);
        req.session.qty.push(req.body.qty);
    }
    }else {
        //First time adding item to cart
        var cart = [];
        cart.push(req.body.product_id);
        req.session.cart = cart;

        var qty = [];
        qty.push(req.body.qty);
        req.session.qty = qty;
    }
    res.redirect('/catalog/cart');
    });
    
 // ==================================================
// Route to show shopping cart
// ==================================================
router.get('/cart', function(req, res, next) {
    if (!Array.isArray(req.session.cart) || !req.session.cart.length){
        res.render('cart', {cartitems: 0 });
    } else {
        let query = "SELECT product_id, name, product_images, price from Products WHERE product_id IN (" + req.session.cart + ") order by find_in_set(product_id, '" + req.session.cart + "');";
   
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.render('error');
            } else {
                res.render('cart', {cartitems: result, qtys: req.session.qty });
            }
        });
    }
    });
    

// ==================================================
// Route to remove an item from the cart
// ==================================================
router.post('/remove', function(req, res, next) {
    // Find the element index of the auto_id that needs to be removed
    var n = req.session.cart.indexOf(req.body.product_id);
    // Remove element from cart and quantity arrays
    req.session.cart.splice(n,1);
    req.session.qty.splice(n,1);
    res.redirect('/catalog/cart');
    });
    

// ==================================================
// Route save cart items to SALEORDER and ORDERDETAILS tables
// ==================================================
router.get('/checkout', function(req, res, next) {
    // Check to make sure the customer has logged-in
    if (typeof req.session.customer_id !== 'undefined' && req.session.customer_id ) {
        // Save SALEORDER Record:
        let insertquery = "INSERT INTO sales_order(customer_id, saledate, payment_status) VALUES (?, now(), 'Paid')";
        db.query(insertquery,[req.session.customer_id],(err, result) => {
            if (err) {
                console.log(err);
                return res.render('error');
            }
            
            var order_id = result.insertId;
            var completed = 0;
            var total = req.session.cart.length;
            
            // Save ORDERDETAIL Records
            req.session.cart.forEach((cartitem, index) => {
                let insertquery = "INSERT INTO order_details(order_id, product_id, saleprice, quantity) VALUES (?, ?, (SELECT price from Products where product_id = ?), ?)";
                db.query(insertquery,[order_id, cartitem, cartitem, req.session.qty[index]],(err, result) => {
                    if (err) {
                        console.log(err);
                        return res.render('error');
                    }
                    
                    completed++;
                    // Only proceed when all inserts are done
                    if (completed === total) {
                        // Empty out the items from the cart and quantity arrays
                        req.session.cart = [];
                        req.session.qty = [];
                        
                        // Display confirmation page
                        res.render('checkout', {ordernum: order_id });
                    }
                });
            });
        });
    } else {
        // Prompt customer to login
        res.redirect('/customers/login');
    }
});
    
module.exports = router;
