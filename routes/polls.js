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
router.post('/addpoll', function(req, res) {
    var db = req.db;
    db.collection('polldb').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
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
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
