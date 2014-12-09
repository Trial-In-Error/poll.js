var express = require('express');
var router = express.Router();
var strings = require('../bin/stringResources');

/* GET poll as JSON */
router.get('/:id', function(req, res) {
	res.render('pollOverview', {title: strings('english', 'pollGridTitle')} );
});

module.exports = router;
