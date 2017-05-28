'use strict'; 

var express = require('express');
var router = express.Router(); 
var Books = require('../models').Books;
var Loans = require('../models').Loans;
var Patrons = require('../models').Patrons;

var pageLimit = 10;

//GET all books and make page
router.get('/', function(req, res, next) { 
	Books.findAndCountAll({limit: pageLimit}).then(function(books) {
		var page = books.count/pageLimit; 
		res.render("partials/books/all_books", {pageCount: page, books : books.rows});
	}).catch(function(error){
		res.send(500, error);
	});
});

//GET books with pagination
router.get('/page/:id', function(req, res, next) { 
	var offsetVariable = (req.params.id - 1) * pageLimit; 
	Books.findAndCountAll({limit: pageLimit, offset: offsetVariable}).then(function(books) {
		var page = books.count/pageLimit; 
		res.render("partials/books/all_books", {pageCount: page, books : books.rows});
	}).catch(function(error){
		res.send(500, error);
	});
});

//GET search a book title
router.get('/search', function(req, res, next) {
	var searchTitle = req.query.searchTitle;
	if(!searchTitle) {
		Books.findAll({order: 'title'}).then(function(books) {
			res.redirect('/books');
		}).catch(function(error){
			res.send(500, error);
		});
	} else {
		Books.findAll({where: {title: {$like: '%' + searchTitle + '%'}}}).then(function(books) {
			res.render("partials/books/all_books", {books : books});
		}).catch(function(error){
			res.send(500, error);
		});
	}
});

//GET a form for new book 
router.get('/new', function(req, res, next) {
	res.render("partials/books/new_book", {book: Books.build()});
});

//POST create a new book 
router.post('/new', function(req, res, next) {
	Books.create(req.body).then(function(book) {
		res.redirect('/books');
	}).catch(function(error) {
		if(error.name === "SequelizeValidationError") {
        res.render('partials/books/new_book', {book: Books.build(req.body), errors: error.errors});
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);

	});
});

//GET overdue books
router.get('/overdue', function(req, res, next) {
	Loans.findAll({include: {model: Books}, 
					where: {return_by: {$lt: new Date()}, returned_on: null}}).then(function(loans) {
		res.render("partials/books/overdue_books", {loans : loans});
  	}).catch(function(error){
    	res.send(500, error);
  	});
});

//GET checked out books 
router.get('/checked', function(req, res, next) {
	Loans.findAll({include: {model: Books}, 
					where: {returned_on: null}}).then(function(loans) {
		res.render("partials/books/checked_books", {loans : loans});
  	}).catch(function(error){
    	res.send(500, error);
  	});
});

//GET book detail by book ID 
router.get('/:id', function(req, res, next) {
  	Books.findById(req.params.id).then(function(book) {
  		Loans.findAll({include: {model: Patrons}, where: {book_id: req.params.id}}).then(function(loans) {
  			res.render("partials/books/book_detail", {book: book, loans: loans});
  		});
 	}).catch(function(error){
    	res.send(500, error);
	});
});

//Put book update 
router.put('/:id', function(req, res, nex) {
	Books.findById(req.params.id).then(function(book) {	
		return book.update(req.body);
	}).then(function(book) {
		res.redirect('/books/' + book.id);
	}).catch(function(error) {
		if(error.name === "SequelizeValidationError") {
	  		Loans.findAll({include: {model: Patrons}, where: {book_id: req.params.id}}).then(function(loans) {
	  			res.render("partials/books/book_detail", {book: book, loans: loans});
	  		});	
	    } else {
	        throw error;
	    }
	}).catch(function(error){
	      	res.send(500, error);
	});
});

module.exports = router;
