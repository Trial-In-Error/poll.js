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
});