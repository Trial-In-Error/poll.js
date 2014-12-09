var express = require('express');
var router = express.Router();
var strings = require('../bin/stringResources');

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
	res.render('pollIndex', { title: strings('english', 'pollIndexTitle') });
});

module.exports = router;