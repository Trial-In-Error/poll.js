var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');

/* Inspect poll */
router.get('/:id', function(req, res) {
	res.render('inspectPoll', { title: strings('english', 'inspectPollTitle') });
});

module.exports = router;
