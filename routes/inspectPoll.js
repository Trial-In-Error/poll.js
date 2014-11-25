var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');

/* GET poll as JSON */
router.get('/:id', function(req, res) {
	res.render('inspectPoll');
});

module.exports = router;
