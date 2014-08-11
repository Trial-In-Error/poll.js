var express = require('express');
var router = express.Router();

/* GET poll list */
router.get('/listpolls', function(req, res){
	var db = req.db;
	db.collection('polldb').find().toArray(function(err, items) {
		res.json(items);
	});
});


/* POST to answer poll */
router.post('/answerpoll', function(req, res) {
    try { 
        var db = req.db;
        var tid = req.body._id;
        delete req.body._id;
        mongo = require('mongoskin');
        db.collection('polldb').update( {_id: mongo.helper.toObjectID(tid)}, db.collection('polldb').findOne({_id: mongo.helper.toObjectID(tid)}, {}, function(err, result){
            //(err === null) ? {console.log('')} : { console.log('Error: ' + err) }
                for (var question in req.body.question_list) {
                    for (var response in req.body.question_list[question].type.response_list) {
                        if(typeof req.body.question_list[question].type.response_list[response].answers[0] !== 'undefined' && typeof req.body.question_list[question].type.response_list[response].answers[0][1] !== 'undefined' && req.body.question_list[question].type.response_list[response].answers[0][1] !== null) {
                            console.log('Appended question '+question+' and response '+response+ '.');
                            console.log('Appended: '+req.body.question_list[question].type.response_list[response].answers);
                            //console.log(result.question_list);
                            //console.log(req.body.question_list);
                            result.question_list[question].type.response_list[response].answers.push(req.body.question_list[question].type.response_list[response].answers[0]);
                        }
                    }
                }
                console.log(JSON.stringify(result, null, 4));
            }), function(err, result) {
            //(err === null) ? {console.log('')} : { console.log('Error: ' + err) }
            console.log(tid);
            console.log(typeof req.body);
        });
    } catch (err) {
        console.log(err);
    }
});


                //res.send(
                //// WARN: THESE COULD LEAK STACK TRACES
                //    (err === null) ? { msg: '' } : { msg: 'Error: ' + err }
                //);

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
