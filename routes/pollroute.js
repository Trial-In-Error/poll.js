var express = require('express');
var router = express.Router();

/* GET poll list */
router.get('/listpolls', function(req, res){
	var db = req.db;
	db.collection('polldb').find().toArray(function(err, items) {
		res.json(items);
	});
});

/* POST to add poll */
router.post('/answerpoll', function(req, res) {
    var db = req.db;
    db.collection('polldb').insert(req.body, function(err, result){
        res.send(
            // WARN: THESE COULD LEAK STACK TRACES
            (err === null) ? { msg: '' } : { msg: 'Error: ' + err }
        );
    });
});

/*
 * DELETE poll.
 */
router.delete('/deletepoll/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('polldb').removeById(userToDelete, function(err, result) {
        // WARN: THESE COULD LEAK STACK TRACES
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
