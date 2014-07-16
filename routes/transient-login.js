var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('test', { title: 'Login', globalExists: global });
});

module.exports = router;