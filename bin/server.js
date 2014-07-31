#!/usr/bin/env node
var app = require('../app');
var http = require('http');
var https = require('https');
var fs = require('fs');

var port = (process.env.PORT || 3000);
var secure_port = 443;


try {
	var options = {
		key: fs.readFileSync('polljs-key.pem'),
		cert: fs.readFileSync('polljs-cert.pem')
	};
} catch (err) {
	console.error(err);
}

http.createServer(app).listen(port);

if(typeof options !== 'undefined' && typeof options.key !== 'undefined' && typeof options.key === 'object' && typeof options.cert !== 'undefined' && typeof options.cert === 'object') {
	https.createServer(options, app).listen(secure_port);
} else {
	console.error('HTTPS server cannot find certificate and key. Did not start.');
}