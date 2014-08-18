var express = require('express');
var router = express.Router();

/* GET poll overview page. */
router.get('/', function(req, res) {
	res.render('polls', { title: 'Express', exists: res.locals.expose.exists});
});

module.exports = router;