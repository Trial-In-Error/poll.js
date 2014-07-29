var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET poll overview page. */
router.get('/', function(req, res) {
  //if( exists_list !== undefined ) {
    //console.log('Matched slash.');
    //console.log(res.locals.expose.exists);
    //console.log('Unmatched slash.');
    //res.locals.expose.passin = passin;
    //res.render('polls', { title: 'Express', exists: exists});
    res.render('polls', { title: 'Express', exists: res.locals.expose.exists});
  //}else{
  //  console.log('Fuck.');
  //}
});

module.exports = router;