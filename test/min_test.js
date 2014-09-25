/*jshint expr: true*/
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongo = require('mongoskin');
var poll1 = require('../example_poll.json');
var poll2 = require('../example_poll_2.json');

describe('Routing:', function() {
	var url = 'http://localhost:3000';
	var pollID;
	var db = mongo.db('mongodb://localhost:27017/polljs', {native_parse:true});
	var pollCount;
	var authString = 'Basic ' + new Buffer('awkward' + ':' + 'awkward').toString('base64');
	//var dbih = require('../bin/database_init_helper_module.js');
	//var sih = require('../bin/server_init_helper_module.js');

	var maxUsernameLength = 32;
	var maxPasswordLength = 32;



	// before testing, clear out our database, then populate it with the two example polls
	before(function(done) {
		//dbih.init(function() {
			//sih.init(function() {
				db.dropDatabase(function(err, result) {
					if(err) { throw err; }
					db.collection('polldb').insert(poll1, function(err, result) {
						if(err) { throw err; }
						db.collection('polldb').insert(poll2, function(err, result) {
							if(err) { throw err; }
							db.collection('polldb').findOne({'id': '10'}, function(err, result) {
								if(err) { throw err; }
								pollID = mongo.helper.toObjectID(result._id);
								done();
							});
						});
					});
				});
			//});
		//});
	});

	describe('register', function() {
		it('should allow a user to register', function(done) {
			request(url)
				.post('/register')
				.send({'username':'awkward', 'password':'awkward'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.be.empty;
					done();
				});
		});

		it('should be safe to use with unusual, Swedish characters', function(done) {
			request(url)
				.post('/register')
				.send({'username':'ÅåÄäÖö', 'password':'ÅåÄäÖö'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.be.empty;
					done();
				});
		});
	});
});