var express = require('express');
var router = express.Router();

/* GET userlist */
//router.get('/userlist', function(req, res){
//	var db = req.db;
//	db.collection('userdb').find().toArray(function(err, items) {
//		res.json(items);
//	});
//});



/*
 * DELETE to deleteuser.
 */
//router.delete('/deleteuser/:id', function(req, res) {
//	var db = req.db;
//	var userToDelete = req.params.id;
//	db.collection('userdb').removeById(userToDelete, function(err, result) {
//		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
//	});
//});

module.exports = router;
