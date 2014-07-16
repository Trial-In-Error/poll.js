var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET test page. */
router.get('/test', function(req, res) {
  res.render('test', { title: 'Express'});
});

module.exports = router;