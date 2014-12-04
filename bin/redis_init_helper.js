var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;

var options = 'redis-server';
function puts(error, stdout, stderr) { sys.puts(stdout); }
exec(options, puts);