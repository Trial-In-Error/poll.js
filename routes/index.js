var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
	//console.log(path.join(__dirname + '/../public/' + '/dist/javascripts/global.js'));
	//console.log(fs.existsSync(path.join(__dirname + '/dist/javascripts/global.js')));
  if(fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/global.js'))) {
  	//console.log('Found minified file. Using it.');
  	res.render('index', { title: 'Express' });
  } else {
  	console.log('WARNING!!! Did not find minified global.js file. Using full file.');
  	console.log('Run `grunt` to construct minified .js files.');
  	res.render('index_fallback', { title: 'Express' });
  }
});

module.exports = router;