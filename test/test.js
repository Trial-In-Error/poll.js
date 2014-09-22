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
	var dbih = require('../bin/database_init_helper_module.js');
	var sih = require('../bin/server_init_helper_module.js');



	// before testing, clear out our database, then populate it with the two example polls
	before(function(done) {
		dbih.init(function() {
			sih.init(function() {
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

		it('should enforce a character limit on username', function(done) {
			request(url)
				.post('/register')
				.send({'username':'', 'password':} )
		});

		it('should allow for promoting a user to admin rights using the DB driver', function(done) {
			db.collection('userdb').update({'type.login.username': 'awkward'}, {$set: {'rights.delete': true, 'rights.openClose': true, 'rights.accessClosed': true}}, function (err, user) {
				if (err) { throw err; }
				done();
			});
		});


	});

	describe('exportpolljson', function() {
		it('should return the poll, in json, to authenticated users', function(done) {
			request(url)
				.get('/pollroute/exportpolljson/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body));
					//console.log(poll2.question_list[0]);
					JSON.stringify(res.body.question_list).should.equal(JSON.stringify(poll2.question_list));
					done();
				});
		});

		//it should have answer data

		it('should not return the poll to unauthenticated users', function(done) {
			request(url)
				.get('/pollroute/exportpolljson/'+pollID)
				.set('authorization', authString+'123')
				.end(function(err, res) {
					if (err) { throw err; }
					JSON.stringify(res.body).should.equal('{}');
					res.status.should.be.equal(302);
					done();
				});
		});

		it('should gracefully handle requests to export non-existant polls', function(done) {
			request(url)
				.get('/pollroute/exportpolljson/'+pollID+'123')
				.set('authorization', authString+'123')
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body));
					//console.log(JSON.stringify(res.status));
					res.status.should.be.equal(302);
					JSON.stringify(res.body).should.be.equal('{}');
					res.header.location.should.be.equal('/meta-login');
					done();
				});
		});
	});

	describe('exportpolljsonclean', function() {
		it('should return the poll, in json, to authenticated users', function(done) {
			request(url)
				.get('/pollroute/exportpolljsonclean/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body));
					//console.log(poll2.question_list[0]);
					JSON.stringify(res.body.question_list).should.equal(JSON.stringify(poll2.question_list));
					done();
				});
		});

		//it should have answer data

		//it should not serve the poll, in json, to unauthenticated users

		//it should gracefully handle requests to export non-existant polls
	});

	//describe importpoll

	//describe closepoll

	//describe openpoll

	//describe answerpoll

	//describe login

	//describe logout

	//describe anonymous login

	//describe nickname login

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

	describe('deletepoll', function() {
		it('should deny unauthorized users', function(done) {
			request(url)
				.delete('/pollroute/deletepoll/'+pollID)
				.set('authorization', authString+'123')
				.end(function(err, res) {
					if(err) { throw err; }
					//console.log(JSON.stringify(res.body));
					//console.log(JSON.stringify(res.status));
					res.body.should.not.exist;
					res.status.should.be.equal(302);
					done();
				});
		});

		it('should let authorized users delete a poll', function(done) {
			request(url)
				.delete('/pollroute/deletepoll/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if(err) { throw err; }
					res.body.msg.should.not.be.ok;
					res.status.should.be.equal(200);
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

		it('should gracefully handle requests to delete a non-existant poll', function(done) {
			request(url)
				.delete('/pollroute/deletepoll/'+'1234567890')
				.set('authorization', authString)
				.end(function(err, res) {
					if(err) { throw err; }
					res.body.msg.should.be.ok;
					res.status.should.be.equal(200);
					done();
				});
		});
	});
});