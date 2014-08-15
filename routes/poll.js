var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

/* GET a specific poll. */
router.get('/:id', ensureAuthenticated, function(req, res) {
	console.log('MATCHED AT /:id.');
	var db = req.db;
	var pollToDisplay = req.params.id;

	var temp = db.collection('polldb').findOne({_id:mongo.helper.toObjectID(pollToDisplay)}, function (err, result) {
					if(err) return err;
					tr = result;
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

//WARN: This is in a really shitty place and will lead to lots of code duplication.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('User is already authenticated. Continuing.');
		return next();
	}
	console.log('User is not already authenticated. Redirecting.');
	console.log('req.session ('+req.session+').redirect_to set to '+req.originalUrl);
	req.session.redirect_to = req.originalUrl;
	//req.session.returnTo = req.path;
	res.redirect('/login')
}