var express = require('express');
var router = express.Router();

/* GET poll overview page. */
router.get('/', function(req, res) {
	var user;
	console.log(res.locals.session.passport.user);
	if(typeof res.locals.session.passport.user !== 'undefined') {
		user = res.locals.session.passport.user;
	} else {
		user = false;
	}
	console.log('User is: '+user);
	res.render('polls', { title: 'Express', exists: res.locals.expose.exists, user: user});
});

module.exports = router;