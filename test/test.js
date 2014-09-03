var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongo = require('mongoskin');
var poll1 = require('../example_poll.json');
var poll2 = require('../example_poll_2.json');
var fs = require('fs');
//var config = require('./config-debug');

describe('Routing', function() {
	var url = 'http://localhost:3000';
	before(function(done) {
		var db = mongo.db('mongodb://localhost:27017/polljs', {native_parse:true});
		db.dropDatabase(function(err, result) {
			if(err) { throw err; };
			db.collection('polldb').insert(poll1, function(err, result) {
				if(err) { throw err; };
				db.collection('polldb').insert(poll2, function(err, result) {
					if(err) { throw err; };
					done();
				});
			});
		});
	});
	describe('listpolls', function() {
		it('should return a list of polls', function(done) {
			request(url)
				.get('/pollroute/listpolls')
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.should.have.property('auth');
					res.body.should.have.property('polls');
					res.body.polls.should.not.be.empty;
					done();
				});
		});
	});
	//describe('')
});