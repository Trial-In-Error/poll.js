var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');

router.get('/', helper.reqCreateRight, function(req, res) {
	res.render('createPoll', { title: strings('english', 'createPollTitle') });
});

module.exports = router;