var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;

var options = 'mongod -dbpath ./data';

// Consider working `nohup` in conditionally?
function puts(error, stdout, stderr) { sys.puts(stdout); }
exec(options, puts);