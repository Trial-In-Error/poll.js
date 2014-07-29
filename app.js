var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var fs = require('fs');

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

var app = express();

var exists_list = {};


function build_min_list(exists_list){
    var files_needed = ['client_polls.js', 'client_poll.js', 'jquery_mobile_1_4_3.js', 'jquery_2_1_1.js', 'combined_style.css'];

    console.log('Looking from: '+String(__dirname));

    for (var entry in files_needed) {
        //console.log('Looking for '+files_needed[entry]);

        // inefficient!
        var exists = false;
        console.log(files_needed[entry].split(".").slice(-1)[0]);
        if (files_needed[entry].split(".").slice(-1)[0] === 'js') {
            console.log('Looked for '+files_needed[entry]);

            exists = fs.existsSync(path.join(__dirname + '/public/dist/javascripts/'+files_needed[entry]));
            if(exists) {
                console.log('Found it!');
            } else {
                console.log('Didn\'t find it!');
            }
        } else if (files_needed[entry].split(".").slice(-1)[0] === 'css') {
            console.log('Looked for '+files_needed[entry]);
            exists = fs.existsSync(path.join(__dirname + '/public/dist/stylesheets/'+files_needed[entry]));
            if(exists) {
                console.log('Found it!');
            } else {
                console.log('Didn\'t find it!');
            }
        }else {
            console.log('Did not find '+files_needed[entry]);
        }
        exists_list[files_needed[entry]] = exists;
    }
    return exists_list;
};



var passin = build_min_list(exists_list);

//console.log(exists_list);

// var passin = exists_list;

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
