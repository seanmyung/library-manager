'use strict'; 

var express = require('express');
var router = express.Router(); 
var Patrons = require('../models').Patrons;
var Books = require('../models').Books;
var Loans = require('../models').Loans;

//GET all patrons 
router.get('/', function(req, res, next) {
	Patrons.findAll({order: 'first_name'}).then(function(patrons) {
		res.render("partials/patrons/all_patrons", {patrons : patrons});
	}).catch(function(error){
		res.send(500, error);
	});
});

//GET a form for new patron 
router.get('/new', function(req, res, next) {
	res.render("partials/patrons/new_patron", {title: "Create a new patron", patron: Patrons.build()});
});

//POST create a new patron
router.post('/new', function(req, res, next) {
	Patrons.create(req.body).then(function(patron) {
		res.redirect('/patrons');
	}).catch(function(error) {
		if(error.name === "SequelizeValidationError") {
        res.render('partials/patrons/new_patron', {patron: Patrons.build(req.body), errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
	});
});

//GET patron detail by patron ID 
router.get('/:id', function(req, res, next) {
  	Patrons.findById(req.params.id).then(function(patron) {
  		Loans.findAll({include: {model: Books}, where: {patron_id: req.params.id}}).then(function(loans) {
  			res.render("partials/patrons/patron_detail", {patron: patron, loans: loans});
  		});
 	}).catch(function(error){
    	res.send(500, error);
	});
});

//PUT patron update 
router.put('/:id', function(req, res, nex) {
	Patrons.findById(req.params.id).then(function(patron) {	
		return patron.update(req.body);
	}).then(function(patron) {
		res.redirect('/patrons');
	}).catch(function(error) {
		if(error.name === "SequelizeValidationError") {
	  		Loans.findAll({include: {model: Books}, where: {patron_id: req.params.id}}).then(function(loans) {
	  			res.render("partials/patrons/patron_detail", {patron: patron, loans: loans});
	  		});	
	    } else {
	        throw error;
	    }
	}).catch(function(error){
	      	res.send(500, error);
	});
});

module.exports = router;
