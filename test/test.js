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

	// before testing, clear out our database, then populate it with the two example polls
	before(function(done) {
		db.dropDatabase(function(err, result) {
			if(err) { throw err; }
			db.collection('polldb').insert(poll1, function(err, result) {
				if(err) { throw err; }
				db.collection('polldb').insert(poll2, function(err, result) {
					if(err) { throw err; }
					db.collection('polldb').findOne({'id': '10'}, function(err, result) {
						if(err) { throw err; }
						//console.log(result._id);
						pollID = mongo.helper.toObjectID(result._id);
						done();
					});
				});
			});
		});
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

		it('should not allow a user to register with an already used name', function(done) {
			request(url)
				.post('/register')
				.send({'username':'awkward', 'password':'badpass'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.not.be.empty;
					done();
				});
		});

		it('should allow for promoting a user to admin rights using the DB driver', function(done) {
			db.collection('userdb').update({'type.login.username': 'awkward'}, {$set: {'rights.delete': true, 'rights.openClose': true, 'rights.accessClosed': true}}, function (err, user) {
				if (err) { throw err; }
				done();
			});
		});


	})


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
					pollCount = JSON.parse(res.body.polls).length;
					done();
				});
		});

		// WARN: THIS TEST IS ABSOLUTELY GODDAMN USELESS UNTIL A POLL IS SUBMITTED
		it('should not expose any of the polls\' answers', function(done) {
			request(url)
				.get('/pollroute/listpolls')
				.end(function(err, res) {
					if (err) { throw err; }
					var list = JSON.parse(res.body.polls);
					for (var index in list) {
						for (var index2 in list[index].question_list) {
							for (var index3 in list[index].question_list[index2].type.response_list) {
								list[index].question_list[index2].type.response_list[index3]
								.should.not.have.property('answer');
							}
						}
					}
					done();
				});
		});
	});

	// WARN: THIS TEST IS ABSOLUTELY GODDAMN USELESS UNTIL THE USER IS LOGGED IN
	// ALSO ALL THE USERS ARE DUMPED WHEN THE DATABASE IS RESET, LOL
	describe('deletepoll', function() {
		it('should deny unauthorized users', function(done) {
			request(url)
				.delete('/pollroute/deletepoll/'+pollID)
				.set('authorization', 'Basic ' + new Buffer('awkward' + ':' + 'badpass').toString('base64'))
				.end(function(err, res) {
					if(err) { throw err; }
					//console.log(JSON.stringify(res.body));
					//console.log(JSON.stringify(res.status));
					res.body.should.not.exist;
					res.status.should.be.equal(302);
					done();
				});
		});

		it('should be able to delete a poll', function(done) {
			request(url)
				.delete('/pollroute/deletepoll/'+pollID)
				.set('authorization', 'Basic ' + new Buffer('awkward' + ':' + 'awkward').toString('base64'))
				.end(function(err, res) {
					if(err) { throw err; }
					db.collection('polldb').findById(pollID, function(err, res) {
						should.not.exist(err);
						//should.not.exist(res);
						db.collection('polldb').find().toArray(function(err, res) {
							should.not.exist(err);
							//console.log(JSON.stringify(res));
							//console.log(JSON.stringify(res.length));
							res.length.should.be.equal(pollCount-1);
							done();
						});
					});
				});
		});
	});
	//describe('')
});