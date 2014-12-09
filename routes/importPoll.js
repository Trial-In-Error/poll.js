var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');

/* Import a poll as JSON */
// This route is slightly broken; true -> "true", for instance...
router.get('/', helper.reqCreateRight, helper.ensureAuth, function(req, res) {
	res.render('importPoll', { title: strings('english', 'importPollTitle') });
});

module.exports = router;
