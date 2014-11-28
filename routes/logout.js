var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	req.logout();
	// Delete local storage of results
	res.redirect('/');
});

module.exports = router;