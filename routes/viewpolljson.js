var express = require('express');
var router = express.Router();

/* GET poll as JSON */
router.get('/:id', function(req, res){
	res.render('view-poll-json');
});

module.exports = router;
