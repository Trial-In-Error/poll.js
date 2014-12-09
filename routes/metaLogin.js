var express = require('express');
var router = express.Router();
var strings = require('../bin/stringResources');

router.get('/', function(req, res) {
	res.render('metaLogin', { title: strings('english', 'metaLoginTitle') });
});

module.exports = router;