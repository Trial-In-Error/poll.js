var express = require('express');
var router = express.Router();

router.post('/anonymous-login', function(req, res, next) {
	// THIS NEEDS TO BE SESSION-IZED
	var redirect_to = req.session.redirect_to || '/';
	console.log('By the way, redirect is set to:'+ req.session.redirect_to+' .');
	console.log('If this ever looks like it\'ll go to /login, please set to / instead.');
	//delete req.session.redirect_to;
	console.log('POST to anonymous-login.');
	passport.authenticate('anonymous', function(err, user, info) {
		//console.log('Start login attempt.');
		if (err) { return next(err); }
		if (!user) {
			//console.log('User login failed.');
			return res.send({ success: false, message: info});
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			//console.log('User login successful.');
			return res.send({success: true, redirect: String(redirect_to)});
		});
		console.log(JSON.stringify(req.session.passport.user));
		console.log(JSON.stringify(res.locals.session.passport.user));
	})(req, res, next);
});

module.exports = router;