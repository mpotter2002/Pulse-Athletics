var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layouts = require('express-ejs-layouts');
const session = require('express-session');

const dotenv = require('dotenv');
dotenv.config();

const mariadb = require('mariadb/callback');
const db = mariadb.createConnection({host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT});

// connect to database
db.connect((err) => {
if (err) {
console.log("Unable to connect to database due to error: " + err);
} else {
console.log("Connected to DB");
}
});
global.db = db;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var helpRouter = require('./routes/help');
var privacyRouter = require('./routes/privacy');
var productRouter = require('./routes/product');
var supplierRouter = require('./routes/suppliers');
var customerRouter = require('./routes/customers');
var membershipRouter = require('./routes/memberships');
var promotionRouter = require('./routes/promotions');
var reviewRouter = require('./routes/reviews');
var saleorderRouter = require('./routes/saleorder');
var orderdetailsRouter = require('./routes/orderdetails');
var reportsRouter = require('./routes/reports');
var searchRouter = require('./routes/search');
var catalogRouter = require('./routes/catalog');

var app = express();

app.use(session({secret: 'GoEasyAppSecret'}));
app.use(function(req,res,next){
res.locals.session = req.session;
next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/help' , helpRouter);
app.use('/privacy' , privacyRouter);
app.use('/product', productRouter);
app.use('/supplier', supplierRouter);
app.use('/customers', customerRouter);
app.use('/memberships', membershipRouter);
app.use('/promotions', promotionRouter);
app.use('/reviews', reviewRouter);  
app.use('/saleorder', saleorderRouter);
app.use('/orderdetails', orderdetailsRouter);
app.use('/reports', reportsRouter);
app.use('/search', searchRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
