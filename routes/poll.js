var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var fs = require('fs');
var path = require('path');

/* GET a specific poll. */
router.get('/:id', function(req, res) {
	//console.log('MATCHED AT /:id.');
	var db = req.db;
	var pollToDisplay = req.params.id;

	if (typeof clientpollsjsexists === 'undefined') {
	    console.log('Looked for client_poll.js.');
	    clientpollsjsexists = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/client_polls.js'));
	}
	if(clientpollsjsexists === false) {
	  	console.log('WARNING!!! Did not find minified client_polls.js file. Using full file.');
	    console.log('Run `grunt` to construct minified .js files.');
	}

	var temp = db.collection('polldb').findOne({_id:mongo.helper.toObjectID(pollToDisplay)}, function (err, result) {
					if(err) return err;
					res.render('poll', {title: 'Poll', poll: result, jsexists: clientpollsjsexists});
				});
});

module.exports = router;
