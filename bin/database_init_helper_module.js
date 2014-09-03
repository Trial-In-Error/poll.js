var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;

exports.init = function(err, data) {
	var options = 'mongod -dbpath ./data';
	var cp = require('child_process');
	var child = cp.fork('./bin/server.js');
	// Consider working `nohup` in conditionally?
	//function puts(error, stdout, stderr) { sys.puts(stdout); }
	//exec(options, puts);
	callback();
}