var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var helper = require('../bin/helper');

function batchSanitize(items) {
	for(var tr in items) {
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
		//console.log(err);
		//console.log(err === null);
		//console.log(typeof err === null);
		console.log(result);
		res.send((err === null) ? result : { msg:'Database error: ' + err });
	});
});

router.get('/exportpolljsonclean/:id', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToExport = req.params.id;
	db.collection('polldb').findOne({_id: mongo.helper.toObjectID(pollToExport)}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		//console.log(err);
		res.send((err === null) ? batchSanitize(result) : { msg:'Database error: ' + err });
	});
});

// JSON validation done entirely with JSON.parse; NO SCHEMA VALIDATION IS DONE HERE!
// UNTESTED
// http://stackoverflow.com/questions/8431415/json-object-validation-in-javascript
router.post('/importpoll', helper.reqCreateRight, helper.ensureAuth, function(req, JSON) {
	var pollToImport;
	try {
		pollToImport = JSON.parse(req.body);
	} catch (err) {
		if (err) { res.send({msg: 'Invalid JSON: '+err}); }
	}
	var db = req.db;
	db.polldb.insert(pollToImport, function(result, err) {
		if (err) {
			res.send({msg: 'Database error: '+err});
		} else {
			res.send({msg: ''});
		}
	});
});


router.post('/closepoll/:id', helper.reqOpenCloseRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToClose = req.params.id;
	db.collection('polldb').update({_id: mongo.helper.toObjectID(pollToClose)}, { $set: {open: false}}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		res.send((result === 1) ? { msg: '' } : { msg:'Database error: ' + err });
	});
});

router.post('/openpoll/:id', helper.reqOpenCloseRight, helper.ensureAuth, function(req, res) {
	var db = req.db;
	var pollToClose = req.params.id;
	db.collection('polldb').update({_id: mongo.helper.toObjectID(pollToClose)}, { $set: {open: true}}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		res.send((result === 1) ? { msg: '' } : { msg:'Database error: ' + err });
	});
});

/* POST to answer poll */
// UNTESTED: Authentication here
// WARN: Consider /answerpoll/:id for flexibility?
router.post('/answerpoll', helper.reqAnswerRight, helper.ensureAuth, function(req, res) {
	try {
		var db = req.db;
		var tid = req.body._id;
		delete req.body._id;
		db.collection('polldb').findOne({_id: mongo.helper.toObjectID(tid)},
			function(err, result) {
				if(err) {
					console.log(err);
				}
				for (var question in req.body.question_list) {
					for (var response in req.body.question_list[question].type.response_list) {
						if(typeof req.body.question_list[question].type.response_list[response].answers !== 'undefined'
							&& typeof req.body.question_list[question].type.response_list[response].answers[0] !== 'undefined'
							&& typeof req.body.question_list[question].type.response_list[response].answers[0].value !== 'undefined'
							&& req.body.question_list[question].type.response_list[response].answers[0].value !== null) {
							//console.log('Appended question '+question+' and response '+response+ '.');
							//console.log('Appended: '+req.body.question_list[question].type.response_list[response].answers);
							//console.log(result.question_list);
							//console.log(req.body.question_list);
							if(typeof result.question_list[question].type.response_list[response].answers === 'undefined') {
								result.question_list[question].type.response_list[response].answers = [];
							}
							result.question_list[question].type.response_list[response].answers.push(req.body.question_list[question].type.response_list[response].answers[0]);
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
		console.log(err);
	}
});

router.get('/frequency/:pollid/:questionid', /*helper.reqGetAnswersRight, helper.ensureAuth,*/ function(req, res) {
	var db = req.db;
	db.collection('polldb').findOne({_id: mongo.helper.toObjectID(req.params.pollid)}, function(err, result) {
		if(err) { throw err; }
		res.send(helper.formatFrequencyCount(helper.frequencyCount(req.params.questionid, result)))
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
		res.send((result === 1) ? { msg: '' } : { msg:'Database error: ' + err });
	});
});

module.exports = router;
