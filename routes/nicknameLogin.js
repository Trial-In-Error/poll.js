var express = require('express');
var router = express.Router();
var passport = require('passport');
var strings = require('../bin/stringResources');

router.get('/', function(req, res, next) {
	res.render('nicknameLogin', { title: strings('english', 'nicknameLoginTitle') });
});

router.post('/', function(req, res, next) {
	// THIS NEEDS TO BE SESSION-IZED
	//console.log('By the way, redirect is set to:'+ req.session.redirect_to+' .');
	//console.log('If this ever looks like it\'ll go to /login, please set to / instead.');
	console.log('TODAYTODAYTODAYTODAY');
	console.log(JSON.stringify(req.session));
	var redirect_to = req.session.redirect_to || '/';
	//delete req.session.redirect_to;
	req.session.lastNickname = req.body.nickname||req.body.username;
	console.log('login matched with usernickname '+req.body.nickname||req.body.username+'.');
	passport.authenticate('nickname', function(err, user, info) {
		console.log('Start login attempt.');
		if (err) { return next(err); }
		if (!user) {
			console.log('User login failed.');
			return res.send({ success: false, message: info});
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			console.log('User login successful.');
			return res.redirect(String(redirect_to) || '/');
		});
	})(req, res, next);
});

module.exports = router;