#!/usr/bin/env node
//var express = require('express');
var debug = require('debug')('nodetest2');
var app = require('../app');
var http = require('http');
var https = require('https');
//var app = express();
var fs = require('fs');

var port = (process.env.PORT || 3000);
var secure_port = 443;

//var server = app.listen(app.get('port'), function() {
//  debug('Express server listening on port ' + server.address().port);
//});



var options = {
	key: fs.readFileSync('polljs-key.pem'),
	cert: fs.readFileSync('polljs-cert.pem')
};

http.createServer(app).listen(port);
https.createServer(options, app).listen(secure_port);

//var secure_server = app.listen(app.get('secure_port'), function() {
//  debug('Express server listening on port ' + server.address().port);
//});