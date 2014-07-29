var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var fs = require('fs');
var path = require('path');
//var JSON = require('JSON');

/* GET a specific poll. */
router.get('/:id', function(req, res) {
	//console.log('MATCHED AT /:id.');
	var db = req.db;
	var pollToDisplay = req.params.id;
	/*if (typeof clientpolljsexists === 'undefined') {
	    console.log('Looked for client_poll.js.');
	    clientpolljsexists = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/client_poll.js'));
	}
	if(clientpolljsexists === false) {
	  	console.log('WARNING!!! Did not find minified client_poll.js file. Using full file.');
	    console.log('Run `grunt` to construct minified .js files.');
	}*/

	var temp = db.collection('polldb').findOne({_id:mongo.helper.toObjectID(pollToDisplay)}, function (err, result) {
					if(err) return err;
					res.locals.expose.result = result;
					//res.expose(result, 'temp_poll');
					res.render('poll', {title: 'Poll', poll: result, exists: res.locals.expose.exists});
				});
});

module.exports = router;
