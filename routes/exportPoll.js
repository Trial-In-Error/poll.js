var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');

/* GET poll as JSON */
router.get('/:id', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res) {
	res.render('exportPoll', { title: strings('english', 'exportPollTitle') });
});

module.exports = router;
