var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
	res.render('login', { user: req.user });
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.post('/', function(req, res, next) {
	// THIS NEEDS TO BE SESSION-IZED
	var redirect_to = req.session.redirect_to || '/';
	console.log('By the way, redirect is set to:'+ req.session.redirect_to+' .');
	console.log('If this ever looks like it\'ll go to /login, please set to / instead.');
	//delete req.session.redirect_to;

	console.log('login matched with username '+req.body.username+' and password '+req.body.password+'.');
	passport.authenticate('local', function(err, user, info) {
		//console.log('Start login attempt.');
		if (err) { return next(err); }
		if (!user) {
			//console.log('User login failed.');
			return res.send({ success: false, message: info});
		}
		req.login(user, function(err) {
			if (err) { return next(err); }
			console.log('User login successful.');
			return res.send({success: true, redirect: String(redirect_to)});
		});
	})(req, res, next);
});

module.exports = router;