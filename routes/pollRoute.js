var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var helper = require('../bin/helper');
var sys = require('sys');

function batchSanitize(items) {
	for(var tr in items) {
		if(!items[tr]) {
			console.log(JSON.stringify(items));
			return false;
		}
		for(var question in items[tr].question_list) {
			for(var response in items[tr].question_list[question].type.response_list) {
				//console.log('Deleted '+items[tr].question_list[question].type.response_list[response].answers);
				delete items[tr].question_list[question].type.response_list[response].answers;
				//console.log('Now it\s '+ items[tr].question_list[question].type.response_list[response].answers);
			}
		}
	}
	return items;
}

router.get('/', function(req, res, next) {
	console.log('API hit!');
	req.api = true;
	res.header('Access-Control-Allow-Origin', '*');
	next();
	//res.send('');
});

/* GET poll list */
router.get('/listpolls', function(req, res) {
	var db = req.db;
	// STUB: Paginate
	db.collection('polldb').find().toArray(function(err, items) {
		if(typeof res.locals !== 'undefined' && typeof res.locals.session.passport.user !== 'undefined') {
			res.send({auth: req.isAuthenticated(), rights: res.locals.session.passport.user.rights, polls:JSON.stringify(batchSanitize(items))});
		} else {
			res.send({auth: false, rights: undefined, polls:JSON.stringify(batchSanitize(items))});
		}
	});
});

router.get('/exportpolljson/:id', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToExport = req.params.id;
	console.log('Looking for '+pollToExport);
	db.collection('polldb').findOne({_id: mongo.helper.toObjectID(pollToExport)}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		console.log(err);
		//console.log(err === null);
		//console.log(typeof result);
		//console.log(sys.inspect(result) === null);
		//console.log(typeof sys.inspect(result) === null);
		//console.log(typeof sys.inspect(result) === 'null');
		//console.log(sys.inspect(result));
		//console.log(JSON.stringify(result));
		if(!result) {
			res.send(404, {error: 'Poll not found.'});
		}
		res.send((err === null) ? result : { msg:'Database error: ' + err });
	});
});

router.get('/exportpolljsonclean/:id', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToExport = req.params.id;
	db.collection('polldb').findOne({_id: mongo.helper.toObjectID(pollToExport)}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		//console.log(err);
		if(!result) {
			res.send(404, {error: 'Poll not found.'});
		}
		res.send((err === null) ? batchSanitize([result])[0] : { msg:'Database error: ' + err });
	});
});

router.post('/closepoll/:id', helper.reqOpenCloseRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToClose = req.params.id;
	db.collection('polldb').update({_id: mongo.helper.toObjectID(pollToClose)}, { $set: {open: false}}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		if(!result) {
			res.send(404, {error: 'Poll not found.'});
		}
		//WARN: DATABSE ERROR SHOULD BE NOT A 200?
		res.send((err === null) ? { msg: '' } : { msg:'Database error: ' + err });
	});
});

router.post('/openpoll/:id', helper.reqOpenCloseRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToClose = req.params.id;
	db.collection('polldb').update({_id: mongo.helper.toObjectID(pollToClose)}, { $set: {open: true}}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		if(!result) {
			res.send(404, {error: 'Poll not found.'});
		}
		res.send((result === 1) ? { msg: '' } : { msg:'Database error: ' + err });
	});
});

function verifyUser(res, req, answer) {
	console.log(JSON.stringify(res.locals.session.passport.user));
	if(typeof res.locals.session.passport.user.type.login !== 'undefined' && typeof res.locals.session.passport.user.type.login.username !== 'undefined') {
		console.log('Question overwritten for a usernamed user.');
		answer.user = {username: res.locals.session.passport.user.type.login.username};
	} else if(typeof res.locals.session.passport.user.type.nickname !== 'undefined') {
		console.log('Question overwritten for a nicknamed user.');
		answer.user = {nickname: res.locals.session.passport.user.type.nickname};
	} else {
		console.log('Question overwritten for an anonymous user.');
		console.log(answer.user);
		answer.user = {anonymous: true, token: answer.user};
	}
	return answer;
}

/* POST to answer poll */
// UNTESTED: Authentication here
// WARN: Consider /answerpoll/:id for flexibility?
router.post('/answerpoll', helper.reqAnswerRight, helper.ensureAuth, function(req, res) {
	console.log('--------------------');
	console.log('req.body: '+req.body);
	try {
		var db = req.db;
		var tid = req.body._id;
		delete req.body._id;
		console.log(tid);
		db.collection('polldb').findOne({_id: mongo.helper.toObjectID(tid)},
			function(err, result) {
				if(err) {
					throw err;
				}
				console.log(result);
				// For every question in the submitted poll
				for (var question in req.body.question_list) {
					// And every response for that question (there should be only 1, but...)
					for (var response in req.body.question_list[question].type.response_list) {
						// If it's been answered
						if(typeof req.body.question_list[question].type.response_list[response].answers !== 'undefined'
							&& typeof req.body.question_list[question].type.response_list[response].answers[0] !== 'undefined'
							&& typeof req.body.question_list[question].type.response_list[response].answers[0].value !== 'undefined'
							&& req.body.question_list[question].type.response_list[response].answers[0].value !== null) {
							//console.log('Appended question '+question+' and response '+response+ '.');
							//console.log('Appended: '+req.body.question_list[question].type.response_list[response].answers);
							//console.log(result.question_list);
							//console.log(req.body.question_list);

							// I think this is never, ever, ever reached...
							if(typeof result.question_list[question].type.response_list[response].answers === 'undefined') {
								result.question_list[question].type.response_list[response].answers = [];
							}
							// Add the answer to the resulting poll
							result.question_list[question].type.response_list[response].answers.push(
								verifyUser(res, req, req.body.question_list[question].type.response_list[response].answers[0])
								);
							//console.log(result.question_list[question].type.response_list[response].answers);
						}
					}
				}
				db.collection('polldb').update( {_id: mongo.helper.toObjectID(tid)}, result, function(err, result) {
					if(err) {
						console.log(err);
					} else {
						res.send((result === 1) ? { msg: '' } : { msg:'Database error: '+ err});
					}
				});
					//console.log(JSON.stringify(result, null, 4));
			});

	} catch (err) {
		console.log(req.body);
		throw err;
	}
});

router.options('/frequency/*', function(req, res, next) {
	try {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', '*');
		res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers')); //allow all headers
		res.send(200,'');
	} catch (err) {
		console.log(err);
		console.log(JSON.stringify(req.headers));
		throw err;
	}
});

router.get('/frequency/:pollid/:questionid', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	//console.log(res.header['Access-Control-Allow-Origin']);
	//console.log('THIS IS FREQUENCY');
	var db = req.db;
	db.collection('polldb').findOne({_id: mongo.helper.toObjectID(req.params.pollid)}, function(err, result) {
		if(err) { throw err; }
		var csv = helper.formatFrequencyCount(helper.frequencyCount(req.params.questionid, result));
		if(typeof csv !== 'undefined') {
			res.send(csv);
		} else {
			// WARN: This might do nothing, or it might do everything. :(
			(req, res, next); // jshint ignore:line
		}
	});
});

router.post('/bucketfrequency/:pollid/:questionid', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res, next) {
	var db = req.db;
		console.log('req.body');
		console.log('----------------------');
		console.log(req.body);
		//console.log(JSON.parse(req.body.bucketList));
		//console.log(typeof JSON.stringify(req.body.bucketList));
		//console.log(typeof JSON.parse(JSON.stringify(req.body.bucketList)));
		//console.log(JSON.parse(req.body.bucketList));
		//console.log(typeof req.body.bucketList);

		blist = req.body.bucketList;

		//blist = [{min:1, max:4, name:"1-4"}, {min:5, max:7, name:"5-7"}, {min:6, max:10, name:"6-10"}];
	db.collection('polldb').findOne({_id: mongo.helper.toObjectID(req.params.pollid)}, function(err, result) {
		if(err) { throw err; }

		var csv = helper.formatUnevenBucketFrequencyCount(helper.unevenBucketFrequencyCount(req.params.questionid, result, blist));
		console.log('CSV');
		console.log('----------------------');
		console.log(csv);
		if(typeof csv !== 'undefined') {
			res.send(csv);
		} else {
			console.log('GODFUCKINGDAMNIT');
			// WARN: This line might do absolutely nothing?
			(req, res, next); // jshint ignore:line
		}
	});
});

/*
 * DELETE poll.
 */
router.delete('/deletepoll/:id', helper.reqDeleteRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('polldb').removeById(userToDelete, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
				if(!result) {
			res.send(404, {error: 'Poll not found.'});
		}
		res.send((result === 1) ? { msg: '' } : { msg:'Database error: ' + err });
	});
});


// JSON validation done entirely with JSON.parse; NO SCHEMA VALIDATION IS DONE HERE!
// UNTESTED
// http://stackoverflow.com/questions/8431415/json-object-validation-in-javascript
router.post('/importpoll', helper.reqCreateRight, helper.ensureAuth, function(req, res) {
	var pollToImport;

	//console.log(JSON.parse(req.body));
	if(req.username) {
		delete req.username;
	}
	if(req.password) {
		delete req.password;
	}
	try {
		pollToImport = req.body;
	console.log('-----------------------');
	console.log(req.body);
	console.log('-----------------------');
	} catch (err) {
		if (err) { res.send({msg: 'Invalid JSON: '+err}); }
	}
	var db = req.db;
	db.collection('polldb').insert(pollToImport, function(err, result) {
		if (err) {
			res.send({msg: 'Database error: '+err});
		} else {
			res.send({success: true, redirect: '/poll/'+result[0]._id, msg: ''});
		}
	});
});

module.exports = router;