var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter = require('./routes/inventory');
var promocodeRouter = require('./routes/promocode');
// var ordersRouter = require('./routes/orders');
var greenhouseRouter = require('./routes/greenhouse');
var smarthomeRouter = require('./routes/smarthome');
var publicRouter = require('./routes/public');



// connections to separate SmartHome App
// the app itself is run on the local microcontroller(arduino Yun)
// these are the connections you want to display to the global internet
// this connection is sensitive and requires proper protection as it may
// control physical actuators and incorporate heavy equipment
// var SmartHomeRouter = require('./SmartHome');

var app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'BackendViews'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
/* Backend Routes*/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter);
app.use('/promocode', promocodeRouter);
// app.use('/orders', ordersRouter);
app.use('/greenhouse', greenhouseRouter);
app.use('/smarthome', smarthomeRouter);

/* Frontend Routes*/
app.use('/public', publicRouter);

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
