var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');

/* */
router.get('/:id', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res) {
	res.render('viewPollJSON');
	// then, serve .js to do AJAX request to pre-populate correctly
});

router.post('/:id', helper.reqEditRight, helper.ensureAuth, function(req, res) {
	// update database with new poll
	res.render('viewPollJSON');
});

router.post('/:id', helper.reqEditRight, helper.ensureAuth, function(req, res) {
});

module.exports = router;
