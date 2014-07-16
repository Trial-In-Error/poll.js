var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  var global = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/global.js'));
  if(!global) {
    console.log('WARNING!!! Did not find minified global.js file. Using full file.');
    console.log('Run `grunt` to construct minified .js files.');
  }
  res.render('index', { title: 'Express', globalExists: global });
});

module.exports = router;