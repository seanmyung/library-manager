'use strict'; 

var express = require('express');
var router = express.Router(); 
var moment = require('moment');
var Loans = require('../models').Loans;
var Books = require('../models').Books;
var Patrons = require('../models').Patrons;

var pageLimit = 5;

//GET all loans and make page
router.get('/', function(req, res, next) {
  Loans.findAndCountAll({limit: pageLimit, include: [{model: Books}, {model: Patrons}]}).then(function(loans) {
    var page = loans.count/pageLimit; 
    res.render("partials/loans/all_loans", {pageCount: page, loans : loans.rows});
  }).catch(function(error){
    res.send(500, error);
  });
});

//GET loans with pagination
router.get('/page/:id', function(req, res, next) { 
  var offsetVariable = (req.params.id - 1) * pageLimit; 
  Loans.findAndCountAll({limit: pageLimit, offset: offsetVariable, include: [{model: Books}, {model: Patrons}]}).then(function(loans) {
    var page = loans.count/pageLimit; 
    res.render("partials/loans/all_loans", {pageCount: page, loans : loans.rows});
  }).catch(function(error){
    res.send(500, error);
  });
});

//GET a form for new loan
router.get('/new', function(req, res, next) {
  Books.findAll().then(function(books) {
  	Patrons.findAll().then(function(patrons) {
  		res.render("partials/loans/new_loan", {
    	books : books,
    	patrons : patrons,
    	loaned_on: moment().format('YYYY-MM-DD'),
      return_by: moment().add(7, 'days').format('YYYY-MM-DD')});
  	}).catch(function(error){
      res.send(500, error);
	});
  });
});

//POST create a new loan
router.post('/new', function(req, res, next) {
	Loans.create(req.body).then(function(loan) {
		res.redirect('/loans');
	}).catch(function(error) {
		if(error.name === "SequelizeValidationError") {
        res.render('partials/loans/new_loan', {loan: Loans.build(req.body), errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);

	});
});

//GET overdue loans
router.get('/overdue', function(req, res, next) {
  Loans.findAll({include: [{model: Books}, {model: Patrons}], 
    where: {returned_on: {$eq: null}, return_by: {$lt: new Date()}}}).then(function(loans) {
      res.render("partials/loans/overdue_loans", {loans : loans});
    }).catch(function(error){
      res.send(500, error);
    });
});

//GET checked out loans
router.get('/checked', function(req, res, next) {
  Loans.findAll({include: [{model: Books}, {model: Patrons}], 
    where: {returned_on: {$eq: null}}}).then(function(loans) {
      res.render("partials/loans/overdue_loans", {loans : loans});
    }).catch(function(error){
      res.send(500, error);
    });
});

//GET return book by book ID
router.get('/:id', function(req, res, next) {
    Books.findById(req.params.id).then(function(book) {
      Loans.findAll({include: {model: Patrons}, where: {book_id: req.params.id}}).then(function(loans) {
        res.render("partials/loans/return_book", {book: book, loans: loans, returned_on: moment().format('YYYY-MM-DD')});
      });
  }).catch(function(error){
      res.send(500, error);
  });
});

//PUT return book by book ID 
router.put('/:id', function(req, res, nex) {
  Loans.findOne({where: {book_id: req.params.id}}).then(function(loan) { 
      return loan.update(req.body);
  }).then(function() {
    res.redirect('/loans');
  }).catch(function(error){
    res.send(500, error);
  });
});


module.exports = router;
