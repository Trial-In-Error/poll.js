var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');

/* GET poll as JSON */
router.get('/:id', function(req, res) {
	res.render('pollGrid', { title: strings('english', 'pollGridTitle') });
});

router.get('/', function(req, res) {
	res.render('pollGridList', { title: strings('english', 'pollGridTitle') });
});

module.exports = router;
