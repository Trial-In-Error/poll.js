#!/usr/bin/env node
//if (process.env.NODE_ENV === 'development') {
//	require('nodetime').profile({
//		accountKey: 'b023cd76db5237236ddcad980a6f3bb6c02d500d',
//		appName: 'devFlashpoll',
//		//debug: true
//	});
//} else {
//	require('nodetime').profile({
//		accountKey: 'b023cd76db5237236ddcad980a6f3bb6c02d500d',
//		appName: 'productionFlashpoll',
//		//debug: true
//	});
//}

//require('look').start();
var app = require('../app');
var http = require('http');
//var https = require('https');
var fs = require('fs');

var port = (process.env.PORT || 3000);

http.get({hostname:'localhost', port:(process.env.PORT || 3000), path:'/', agent:false}, function (res) {
	// Do stuff
});

//var port = (process.env.PORT || 3000);
var secure_port = 443;


try {
	var options = {
		key: fs.readFileSync('polljs-key.pem'),
		cert: fs.readFileSync('polljs-cert.pem')
	};
} catch (err) {
	console.log('Could not find '+err.path);
} finally {
	http.createServer(app).listen(port);
	//if(typeof options !== 'undefined' && typeof options.key !== 'undefined' && typeof options.key === 'object' && typeof options.cert !== 'undefined' && typeof options.cert === 'object') {
	//	https.createServer(options, app).listen(secure_port);
	//} else {
	//	console.log('HTTPS server did not start because it could not find the certificate and key.');
	//}
}