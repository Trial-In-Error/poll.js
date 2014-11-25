var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');

/* */
router.get('/', helper.reqCreateRight, helper.ensureAuth, function(req, res) {
	res.render('importPoll');
	// then, serve .js to do AJAX request to pre-populate correctly
});

module.exports = router;
