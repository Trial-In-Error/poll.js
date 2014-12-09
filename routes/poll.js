var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');

/* GET a specific poll. */
router.get('/:id', function(req, res) {
	console.log('MATCHED AT /:id.');
	var db = req.db;
	var pollToDisplay = req.params.id;

	var temp = db.collection('polldb').findOne({_id:mongo.helper.toObjectID(pollToDisplay)}, function (err, result) {
		if(err) return err;
		tr = result;

		// In the edge case where you request a nonexistant poll through a client-side redirect
		// This safeguards the server from crashing & seamlessly redirects to error page
		if(tr === null) {
			res.render('error', {title: string('english', 'errorTitle'), error: {status: strings('english', 'pollNotFound')} });
			return;
		}

		if(typeof tr.open !== 'undefined' && !tr.open) {
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
		res.render('poll', {title: strings('english', 'pollTitle', tr.name), poll: tr, exists: res.locals.expose.exists});
	});
});

module.exports = router;

