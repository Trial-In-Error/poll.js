var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  if (typeof globaljsexists === 'undefined')
  {
    console.log('Looked for global.js.');
    globaljsexists = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/global.js'));
  }
  if(globaljsexists === false) {
    console.log('WARNING!!! Did not find minified global.js file. Using full file.');
    console.log('Run `grunt` to construct minified .js files.');
  }
  res.render('index', { title: 'Express', globalExists: globaljsexists });
});

module.exports = router;