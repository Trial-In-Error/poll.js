var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET poll overview page. */
router.get('/', function(req, res) {
if (typeof clientpollsjsexists === 'undefined')
  {
    console.log('Looked for client_polls.js.');
    clientpollsjsexists = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/client_polls.js'));
  }
  if(clientpollsjsexists === false) {
  	console.log('WARNING!!! Did not find minified client_polls.js file. Using full file.');
    console.log('Run `grunt` to construct minified .js files.');
  }
  //console.log('WARNING!!! client_polls.js does NOT have a minified form or look for a minified form.');

  res.render('polls', { title: 'Express', globalExists: clientpollsjsexists });
});

module.exports = router;