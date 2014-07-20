var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');

// Database
var mongo = require('mongoskin');

// Rename this database!
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parse:true});

var routes = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');
var transientlogin = require('./routes/transient-login');
var pollindex = require('./routes/pollindex');
var pollroute = require('./routes/pollroute');
var poll = require('./routes/poll');

var app = express();

var globaljsexists;
var clientpollsjsexists;
var clientpolljsexists;

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
    req.db = db;
    next();
})


app.use('/', routes);
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
