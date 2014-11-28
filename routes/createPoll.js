var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');

router.get('/', helper.reqCreateRight, function(req, res) {
	res.render('createPoll', { user: req.user });
});

module.exports = router;