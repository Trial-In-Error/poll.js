var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

//WARN: This is in a really shitty place and will lead to lots of code duplication. It's also in pollroute.js
function ensureAuthenticated(req, res, next) {
	var priv = req.priv;
	req.priv = undefined;
	console.log('ensureAuth: '+res.locals.session.passport.user);
	if (req.isAuthenticated() && typeof res.locals.session.passport.user.rights[priv] !== 'undefined' && res.locals.session.passport.user.rights[priv]) {
		//console.log('User is already authenticated. Continuing.');
		return next();
	}
	req.session.redirect_to = req.path;
	//console.log('User is not already authenticated. Redirecting.');
	//req.session.returnTo = req.path;
	res.redirect('/login');
}

function reqAnswerRight(req, res, next) {
	req.priv = 'answer';
	return next();
}

/* GET a specific poll. */
router.get('/:id', reqAnswerRight, ensureAuthenticated, function(req, res) {
	console.log('MATCHED AT /:id.');
	var db = req.db;
	var pollToDisplay = req.params.id;

	var temp = db.collection('polldb').findOne({_id:mongo.helper.toObjectID(pollToDisplay)}, function (err, result) {
		if(err) return err;
		tr = result;

		if(!tr.open) {
			if (req.isAuthenticated() && typeof res.locals.session.passport.user.rights.accessClosed !== 'undefined' && res.locals.session.passport.user.rights.accessClosed) {
			} else {
				req.session.redirect_to = req.path;
				res.redirect('/login');				
			}
		}

		// CLEANS!
		for(var question in tr.question_list) {
			for(var response in tr.question_list[question].type.response_list) {
				delete tr.question_list[question].type.response_list[response].answers;
			}
		}

		res.locals.expose.result = tr;
		//res.expose(result, 'temp_poll');
		res.render('poll', {title: 'Poll', poll: tr, exists: res.locals.expose.exists});
	});
});

module.exports = router;

