'use strict';

var express = require('express'); 
var path = require('path');
var methodOverride = require('method-override');
var logger = require('morgan'); 
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser'); 


var routes = require('./routes/index');
var booksRoutes = require('./routes/books');
var patronsRoutes = require('./routes/patrons');
var loansRoutes = require('./routes/loans');

var app = express(); 

app.set('view engine', 'pug'); 
app.set('views', path.join(__dirname, 'views')); 

app.use(methodOverride('_method'));
app.use(logger('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes); 
app.use('/books', booksRoutes);
app.use('/patrons', patronsRoutes);
app.use('/loans', loansRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
