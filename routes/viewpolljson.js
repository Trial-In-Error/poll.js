var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');

/* GET poll as JSON */
router.get('/:id', helper.reqGetAnswersRight, helper.ensureAuth, function(req, res) {
	res.render('view-poll-json');
});

module.exports = router;
