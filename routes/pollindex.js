var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET poll overview page. */
router.get('/', function(req, res) {
/*  if (typeof globaljsexists === 'undefined')
  {
    console.log('Looked for global.js.');
    globaljsexists = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/globasdfasdfal.js'));
  }
  if(globaljsexists === false) {
    console.log('Run `grunt` to construct minified .js files.');
  }*/
  console.log('WARNING!!! client_polls.js does NOT have a minified form or look for a minified form.');
  res.render('polls', { title: 'Express', globalExists: global });
});

module.exports = router;