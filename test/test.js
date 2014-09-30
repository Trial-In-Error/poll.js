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
	var pollAnswered;
	var maxUsernameLength = 32;
	var maxPasswordLength = 32;

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
						//console.log(mongo.helper.toObjectID(result._id));
						pollID = mongo.helper.toObjectID(result._id);
						//console.log(result._id);
						pollAnswered = {"_id":result._id,"name":"Client-side stress test","id":"10","open":true,"owner":"#swedish_summer_sucks","allow_skipping":false,"question_list":[{"body":"Welcome to this poll!","type":{"name":"not_a_question"},"opening_slide":true},{"body":"When are these questions explainable?","type":{"name":"pick_n","n":1,"response_list":[{"body":"Never.","answers":[{"user":"00977379","value":true,"timestamp":1412072532693}]},{"body":"When selected and required.","explanation":{"always_explainable":false,"explain_text":"Please enter some stuff to continue.","required":true},"answers":[{"skipped":false}]},{"body":"Always but not required.","explanation":{"always_explainable":true,"explain_text":"Optionally explain.","required":false},"answers":[{"skipped":false}]}]}},{"body":"This page is the only one that's skippable.","type":{"name":"not_a_question"},"allow_skipping":true},{"body":"Please select between 2 and 5 words.","type":{"name":"pick_n","n":5,"require":2,"response_list":[{"body":"Zero.","answers":[{"skipped":false}]},{"body":"Lilt.","answers":[{"skipped":false}]},{"body":"Wiser.","answers":[{"user":"00977379","value":true,"timestamp":1412072537261}]},{"body":"Orange.","answers":[{"skipped":false}]},{"body":"Agrarian.","answers":[{"user":"00977379","value":true,"timestamp":1412072537261}]},{"body":"Silly.","answers":[{"skipped":false}]},{"body":"Obelisk.","answers":[{"user":"00977379","value":true,"timestamp":1412072537261}]},{"body":"Quaff.","answers":[{"skipped":false}]}]}},{"body":"Pick your two favorite.","type":{"name":"pick_n","n":2,"require":2,"response_list":[{"body":"Coffee.","answers":[{"user":"00977379","value":true,"timestamp":1412072539338}]},{"body":"Video-games.","answers":[{"user":"00977379","value":true,"timestamp":1412072539338}]},{"body":"Cats.","answers":[{"skipped":false}]},{"body":"Beer.","answers":[{"skipped":false}]}]},"next":"slider"},{"body":"This question should have been passed over by 'next'.","type":{"name":"not_a_question"}},{"body":"Explain what you think of this slider.","type":{"name":"slider","min":-5,"max":5,"step":1.5,"up_and_up":true,"response_list":[{"explanation":{"always_explainable":true,"required":true},"answers":[{"skipped":false}]}]},"id":"slider"},{"body":"Thank you for taking the time to answer this poll!","type":{"name":"not_a_question"},"closing_slide":true}]}
						//console.log(result._id);
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
					res.status.should.be.equal(400, 'incorrect HTTP response code');
					res.body.msg.should.not.be.empty;
					done();
				});
		});

		// this matches routes/register.js's verification, which should probs be in helper.js instead
		it('should enforce an upper character limit on usernames', function(done) {
			var temp_username = ''
			for (var i = 0; i < maxUsernameLength; i++) {
				temp_username += '1'
			}
			request(url)
				.post('/register')
				.send({'username': temp_username, 'password':'asdfasdf'} )
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.be.empty;
					request(url)
						.post('/register')
						.send({'username': temp_username.concat('1'), 'password':'asdfasdf'} )
						.end(function(err, res) {
							if (err) { throw err; }
							res.status.should.be.equal(400, 'incorrect HTTP response code');
							res.body.msg.should.not.be.empty;
							done();
						});
				});
		});

		it('should enforce an upper character limit on passwords', function(done) {
			var temp_password = ''
			for (var i = 0; i < maxPasswordLength; i++) {
				temp_password += '1'
			}
			request(url)
				.post('/register')
				.send({'username': 'upperpasstest', 'password':temp_password} )
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.be.empty;
					request(url)
						.post('/register')
						.send({'username': 'upperpasstest2', 'password':temp_password.concat('1')} )
						.end(function(err, res) {
							if (err) { throw err; }
							res.status.should.be.equal(400, 'incorrect HTTP response code');
							res.body.msg.should.not.be.empty;
							done();
						});
				});
		});

		it('should enforce a lower character limit on passwords', function(done) {
			request(url)
				.post('/register')
				.send({'username': 'lowerpasstest', 'password':'longenough'} )
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.be.empty;
					request(url)
						.post('/register')
						.send({'username': 'lowerpasstest2', 'password':'2sml'} )
						.end(function(err, res) {
							if (err) { throw err; }
							res.status.should.be.equal(400, 'incorrect HTTP response code');
							res.body.msg.should.not.be.empty;
							done();
						});
				});
		});

		it('should not allow a user to register a username with special characters', function(done) {
			request(url)
				.post('/register')
				.send({'username':'awk ward', 'password':'badpass'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(400, 'incorrect HTTP response code');
					res.body.msg.should.not.be.empty;
					done();
				});
		});

		it('should not allow a user to register with a password containing special', function(done) {
			request(url)
				.post('/register')
				.send({'username':'specialchartest', 'password':'!23-4'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(400, 'incorrect HTTP response code');
					res.body.msg.should.not.be.empty;
					done();
				});
		});

		it('should allow for promoting a user to admin rights using the DB driver', function(done) {
			db.collection('userdb').update({'type.login.username': 'awkward'}, {$set: {'rights.delete': true, 'rights.openClose': true, 'rights.accessClosed': true, 'rights.getAnswers': true, 'rights.create': true}}, function (err, user) {
				if (err) { throw err; }
				done();
			});
		});

		it.skip('should immediately log the user in after registering', function(done) {
			//
		});

		it.skip('should not let logged in users register', function(done) {
			//
		});
	});

	describe('exportpolljson', function() {
		it('should return the poll, in json, to authenticated users', function(done) {
			request(url)
				.get('/pollroute/exportpolljson/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					JSON.stringify(res.body.question_list).should.equal(JSON.stringify(poll2.question_list));
					done();
				});
		});

		it.skip('should have answer data', function(done) {
			//
		});

		it('should not return the poll to unauthenticated users', function(done) {
			request(url)
				.get('/pollroute/exportpolljson/'+pollID)
				.set('authorization', authString+'123')
				.end(function(err, res) {
					if (err) { throw err; }
					JSON.stringify(res.body).should.equal('{}');
					res.status.should.be.equal(302);
					res.header.location.should.be.equal('/meta-login');
					done();
				});
		});

		it('should gracefully handle requests to export non-existant polls', function(done) {
			request(url)
				.get('/pollroute/exportpolljson/'+pollID+'123')
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(404);
					res.error.should.not.be.empty;
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
					JSON.stringify(res.body.question_list).should.equal(JSON.stringify(poll2.question_list));
					done();
				});
		});

		it.skip('should not have answer data', function(done) {
			//
		});

		it('should not return the poll to unauthenticated users', function(done) {
			request(url)
				.get('/pollroute/exportpolljsonclean/'+pollID)
				.set('authorization', authString+'123')
				.end(function(err, res) {
					if (err) { throw err; }
					JSON.stringify(res.body).should.equal('{}');
					res.status.should.be.equal(302);
					res.header.location.should.be.equal('/meta-login');
					done();
				});
		});

		it('should gracefully handle requests to export non-existant polls', function(done) {
			request(url)
				.get('/pollroute/exportpolljsonclean/'+pollID+'123')
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(404);
					res.error.should.not.be.empty;
					done();
				});
		});
	});

	describe('importpoll', function() {
		it('should allow an authenticated user to add a valid poll', function(done) {
			request(url)
				.post('/pollroute/importpoll')
				.send({'name': 'Invalid Poll', 'owner': 'importpoll_test_suite'})
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200);
					res.body.success.should.be.true;
					done();
				});
		});

		it('should not allow unauthenticated users to add a poll', function(done) {
			request(url)
				.post('/pollroute/importpoll')
				.send({'name': 'Invalid Poll', 'owner': 'importpoll_test_suite'})
				.set('authorization', authString+'123')
				.end(function(err, res) {
					if (err) { throw err; }
					JSON.stringify(res.body).should.equal('{}');
					res.status.should.be.equal(302);
					res.header.location.should.be.equal('/meta-login');
					// STUB: This could check the DB for actual contents
					done();
				});
		});

		it('should gracefully handle invalid polls', function(done) {
			request(url)
				.post('/pollroute/importpoll')
				.set({'Content-Type': 'application/json'})
				.set('authorization', authString)
				.send('THIS ISN\'T VALID JSON!')
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(400);
					res.error.should.not.be.empty;
					done();
				});
		});

		it('should redirect to the poll\'s page on a successful import', function(done) {
			request(url)
				.post('/pollroute/importpoll')
				.send({'name': 'Invalid Poll', 'owner': 'importpoll_test_suite'})
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200);
					res.body.success.should.be.true;
					res.body.redirect.should.not.be.empty;
					// STUB: This could check the DB for actual contents
					done();
				});
		});
	});

	describe('closepoll', function() {
		it('should allow an authenticated user to close a poll', function(done) {
			request(url)
				.post('/pollroute/closepoll/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200);
					res.body.msg.should.be.empty;
					db.collection('polldb').findById(pollID, function(err, res) {
						should.not.exist(err);
						res.open.should.be.false;
						done();
					});
				});
		});

		it('should gracefully handle requests to close already closed polls', function(done) {
			request(url)
				.post('/pollroute/closepoll/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200);
					res.body.msg.should.be.empty;
					db.collection('polldb').findById(pollID, function(err, res) {
						should.not.exist(err);
						res.open.should.be.false;
						done();
					});
				});
		});

		it('should not allow unauthenticated users to close polls', function(done) {
			db.collection('polldb').update({_id: mongo.helper.toObjectID(pollID)}, {$set: {open: true}}, function(err, res) {
				if (err) { throw err; }
				request(url)
					.post('/pollroute/closepoll/'+pollID)
					.set('authorization', authString+'123')
					.end(function(err, res) {
						if (err) { throw err; }
						res.status.should.be.equal(302);
						db.collection('polldb').findById(pollID, function(err, res) {
							should.not.exist(err);
							res.open.should.be.true;
							done();
						});
					});
			});
		});

		it('should gracefully handle requests to close non-existant polls', function(done) {
			request(url)
				.post('/pollroute/closepoll/'+pollID+'123')
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(404);
					res.body.error.should.not.be.empty;
					done();
				});
		});

		it.skip('should reverse openpoll', function(done) {
			//
		});
	});

	describe('openpoll', function() {
		it('should allow an authenticated user to open a poll', function(done) {
			request(url)
				.post('/pollroute/openpoll/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200);
					res.body.msg.should.be.empty;
					db.collection('polldb').findById(pollID, function(err, res) {
						should.not.exist(err);
						res.open.should.be.true;
						done();
					});
				});
		});

		it('should gracefully handle requests to open already opened polls', function(done) {
			request(url)
				.post('/pollroute/openpoll/'+pollID)
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(200);
					res.body.msg.should.be.empty;
					db.collection('polldb').findById(pollID, function(err, res) {
						should.not.exist(err);
						res.open.should.be.true;
						done();
					});
				});
		});

		it('should not allow unauthenticated users to open polls', function(done) {
			db.collection('polldb').update({_id: mongo.helper.toObjectID(pollID)}, {$set: {open: false}}, function(err, res) {
				if (err) { throw err; }
				request(url)
					.post('/pollroute/openpoll/'+pollID)
					.set('authorization', authString+'123')
					.end(function(err, res) {
						if (err) { throw err; }
						res.status.should.be.equal(302);
						db.collection('polldb').findById(pollID, function(err, res) {
							should.not.exist(err);
							res.open.should.be.false;
							done();
						});
					});
			});
		});

		it('should gracefully handle requests to open non-existant polls', function(done) {
			request(url)
				.post('/pollroute/openpoll/'+pollID+'123')
				.set('authorization', authString)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.be.equal(404);
					res.body.error.should.not.be.empty;
					done();
				});
		});

		it.skip('should reverse closepoll', function(done) {
			//
		});
	});

	describe('answerpoll', function() {
		it('should allow an authenticated user to submit answers to a poll', function(done) {
			request(url)
				.post('/pollroute/answerpoll')
				.send(pollAnswered)
				.set('authorization', authString)
				.set({'Content-Type': 'application/json'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.body.polls));
					//console.log(JSON.parse(res.body.polls).length);
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.msg.should.be.empty;
					db.collection('polldb').findById(pollID, function(err, res) {
						//console.log('---------');
						should.not.exist(err);
						for (questionCount in res.question_list) {
							for (responseCount in res.question_list[questionCount].type.response_list) {
								//console.log(res.question_list[questionCount].type)
								if(typeof res.question_list[questionCount].type.response_list[responseCount].answers !== 'undefined') {
									res.question_list[questionCount].type.response_list[responseCount].answers[0].should.exist;
									res.question_list[questionCount].type.response_list[responseCount].answers[0].user.should.exist;
									res.question_list[questionCount].type.response_list[responseCount].answers[0].value.should.exist;
									res.question_list[questionCount].type.response_list[responseCount].answers[0].timestamp.should.exist;
								}
							}
						}
						done();
					});
				});
		});

		it('should not allow an unauthenticated user to submit answers to a poll', function(done) {
			request(url)
				.post('/pollroute/answerpoll')
				.send(pollAnswered)
				.set('authorization', authString+'123')
				.set({'Content-Type': 'application/json'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.status) + "   " + JSON.stringify(res.body));
					res.status.should.be.equal(302);
					res.body.should.be.empty;
					done();
				});
		});

		it('should overwrite the user field on responses on the server side', function(done) {
			db.collection('polldb').findById(pollID, function(err, res) {
				should.not.exist(err);
				for (questionCount in res.question_list) {
					for (responseCount in res.question_list[questionCount].type.response_list) {
						//console.log(res.question_list[questionCount].type)
						if(typeof res.question_list[questionCount].type.response_list[responseCount].answers !== 'undefined') {
							res.question_list[questionCount].type.response_list[responseCount].answers[0].user.should.exist;
							res.question_list[questionCount].type.response_list[responseCount].answers[0].user.username.should.exist;
							should.not.exist(res.question_list[questionCount].type.response_list[responseCount].answers[0].user.password);
							res.question_list[questionCount].type.response_list[responseCount].answers[0].value.should.exist;
							res.question_list[questionCount].type.response_list[responseCount].answers[0].timestamp.should.exist;
						}
					}
				}
				done();
			});
		});

		it.skip('should preserve explanation fields', function(done) {
			done();
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

		it.skip('should not expose any of the polls\' responses', function(done) {
		//	request(url)
		//		.get('/pollroute/listpolls')
		//		.end(function(err, res) {
		//			if (err) { throw err; }
		//			var list = JSON.parse(res.body.polls);
		//			for (var index in list) {
		//				for (var index2 in list[index].question_list) {
		//					for (var index3 in list[index].question_list[index2].type.response_list) {
		//						list[index].question_list[index2].type.response_list[index3]
		//						.should.not.have.property('answer');
		//					}
		//				}
		//			}
		//			done();
		//		});
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

		it.skip('should let authorized users delete a poll', function(done) {
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
					//console.log(JSON.stringify(res.body))
					res.body.error.should.exist;
					res.status.should.be.equal(404);
					done();
				});
		});
	});

	describe('login', function() {
		it('should allow a user to login with valid credentials', function(done) {
			request(url)
				.post('/login')
				.send({'username':'awkward', 'password':'awkward'})
				.set({'Content-Type': 'application/json'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.status) + "   " + JSON.stringify(res.body));
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.success.should.be.true;
					res.body.redirect.should.not.be.empty;
					done();
				});
		});

		it('should not allow a user to login with invalid credentials', function(done) {
			request(url)
				.post('/login')
				.send({'username':'awkward'+'123', 'password':'awkward'})
				.set({'Content-Type': 'application/json'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.status) + "   " + JSON.stringify(res.body));
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.message.should.not.be.empty;
					done();
				});
		});

		it('should handle Swedish characters gracefully', function(done) {
			request(url)
				.post('/login')
				.send({'username':'ÅåÄäÖö', 'password':'ÅåÄäÖö'})
				.set({'Content-Type': 'application/json'})
				.end(function(err, res) {
					if (err) { throw err; }
					//console.log(JSON.stringify(res.status) + "   " + JSON.stringify(res.body));
					res.status.should.be.equal(200, 'incorrect HTTP response code');
					res.body.success.should.be.true;
					res.body.redirect.should.not.be.empty;
					done();
				});
		});

		it.skip('should ... multi-login work ... ?', function(done) {
			//
		});

		it.skip('should specify what part of the credentials generated the error', function(done) {
			//
		});
	});

	describe.skip('anonymous-login', function() {
		it('should allow the user to log in', function(done) {

		});

		it('should gracefully handle requests to login when already logged in', function(done) {

		});
	});

	describe.skip('nickname-login', function() {
		it('should allow the user to login with a valid nickname', function(done) {

		});

		it('should not allow nicknames to have special characters', function(done) {

		});

		it('should allow Swedish characters in nicknames', function(done) {

		});

		it('should impose an upper character limit on nicknames', function(done) {

		});
	});

	describe.skip('logout', function() {
		it('should log the user out', function(done) {
			//
		});

		it('should gracefully handle requests to log out when already logged out', function(done) {

		});
	});

	describe('404', function() {
		it('should respond with a 404 error when an invalid page is requested', function(done) {
			request(url)
				.get('/404')
				.end(function(err, res) {
					if(err) { throw err; }
					res.status.should.be.equal(404);
					done();
				});
		});
	})
});