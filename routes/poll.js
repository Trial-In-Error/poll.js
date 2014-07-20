var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

/* GET a specific poll. */
router.get('/:id', function(req, res) {
	console.log('MATCHED AT /:id.');
	var db = req.db;
	var pollToDisplay = req.params.id;


	var temp = db.collection('polldb').findOne({_id:mongo.helper.toObjectID(pollToDisplay)}, function (err, result) {
					if(err) return err;
					res.render('poll', {title: 'Poll', poll: result});
				});
	//res.render('poll', {title: 'Poll', poll: temp.id , poll2:temp._id, pollactual: temp});
});

module.exports = router;
