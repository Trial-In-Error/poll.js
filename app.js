var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');

// Database
var mongo = require('mongoskin');

// Use the mongo database named 'polljs'
var db = mongo.db("mongodb://localhost:27017/polljs", {native_parse:true});

var users = require('./routes/users');
var test = require('./routes/test');
var transientlogin = require('./routes/transient-login');
var pollindex = require('./routes/pollindex');
var pollroute = require('./routes/pollroute');
var poll = require('./routes/poll');

// In prior versions of Express, this was a call express.createServer();
// To support https, this will have to change.
//WARN: Support HTTPS by changing this as per:
//https://github.com/strongloop/express/wiki/Migrating-from-2.x-to-3.x
//http://www.hacksparrow.com/express-js-https.html
//http://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
//http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server
//http://stackoverflow.com/questions/11744975/enabling-https-on-express-js
var app = express();

var exists_list = {};

var build_min_list = require('./bin/build_min_list.js')

var passin = build_min_list.build(exists_list);

console.log(exists_list);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.expose = {exists: passin};
  // you could alias this as req or res.expose
  // to make it shorter and less annoying
  next();
});

app.use(function(req, res, next){
    req.db = db;
    next();
})


app.use('/', pollindex);
app.use('/users', users);
app.use('/test', test);
app.use('/transient-login', transientlogin);
app.use('/polls', pollindex);
app.use('/pollroute', pollroute);
app.use('/poll', poll);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //console.log(util.inspect(req.url.slice(-3)));
    var err = new Error('Not Found\n'+'req: '+req.originalUrl);
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
