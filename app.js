var express = require('express');
var session = require('express-session');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;
var Chance = require('chance');
var alea = new Chance();
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');

// STUB: REMOVE THIS LINE!
var helper = require('./bin/helper');

// Database
var mongo = require('mongoskin');
// Use the remote mongo database if available (i.e., app is heroku hosted), else use the local one named 'polljs'
if(typeof process.env.MONGOLAB_URI !== 'undefined') {
	console.log(process.env.MONGOLAB_URI);
}
var db = mongo.db(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polljs', {native_parse:true});

var pollindex = require('./routes/pollindex');
var pollroute = require('./routes/pollroute');
var poll = require('./routes/poll');
var register = require('./routes/register');
var exportpolljson = require('./routes/exportpolljson');
var viewpolljson = require('./routes/viewpolljson');

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

var build_min_list = require('./bin/build_min_list.js');

var passin = build_min_list.build(exists_list);

console.log(exists_list);





// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	//findById(id, function (err, user) {
	//var user = {'id': 1};
	console.log('deserialize found: '+user);
	done(null, user);
	//done(err, user);
	//});
});

function findByUsername(username, fn) {
	// find().limit(1) SERVING findOne
	// see: https://blog.serverdensity.com/checking-if-a-document-exists-mongodb-slow-findone-vs-find/
	db.collection('userdb').findOne({'type.login.username': String(username)}, function (err, user) {
		if(err) return err;
		if(user) {
			//console.log('User found in database.');
			return fn(null, user);
		} else {
			//console.log('User not found in database.');
			return fn(null, null);
		}
	});
}

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use('local', new LocalStrategy(
	function(username, password, done) {
		console.log('Authenticating user.');
		// asynchronous verification, for effect...
		process.nextTick(function () {
			console.log('Tick.');
			findByUsername(username, function(err, user) {
				console.log('localStrategy found: '+user);
				console.log(user);
				if (err) {return done(err);}
				if (!user) {
					//console.log('We\'ve failed!');
					//console.log(user);
					//console.log(!user);
					return done(null, false, {message: 'Unknown user '+username+'.'});
				}
				bcrypt.compare(password, user.type.login.passhash, function(err, res) {
					if(res) {
						return done(null, user);
					} else {
						return done(null, false, {message: 'Incorrect password.'});
					}
				});
				//if (user.type.login.password !== password ) {
				//	return done(null, false, {message: 'Incorrect password.'});
				//}
			});
		});
	}
));

passport.use('anonymous', new LocalStrategy(
	function(username, password, done) {
		console.log('Logging in anonymous user.');
		// asynchronous verification, for effect...
		process.nextTick(function () {
			return done(null, {});
		});
	}
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(express.methodOverride()); // what does this do? tutorial for passport.js used it

// session() must be called before passport.session()!
app.use(session({secret: alea.string({length:20}), resave: true, saveUninitialized: true}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// WARN: THE API SERVER DOES SESSION-BASED AUTH!!!
app.use(function(req, res, next) {
	// auth is in base64(username:password)  so we need to decode the base64
	var auth = req.headers.authorization;
	console.log('Authorization Header is: ', auth);

	// The Authorization was passed in so now we validate it
	if(auth) {
		try {
			// Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
			var tmp = auth.split(' ');
			// create a buffer and tell it the data coming in is base64
			var buf = new Buffer(tmp[1], 'base64');
			// read it back out as a string
			var plain_auth = buf.toString();
			console.log('Decoded Authorization ', plain_auth);
			// At this point plain_auth = "username:password"
			var creds = plain_auth.split(':');
			req.body.username = creds[0];
			req.body.password = creds[1];			
		} catch (err) {
			console.log(err);
		}
	}
	next();
});


app.use(function(req, res, next){
	// you could alias this as req or res.expose
	// to make it shorter and less annoying
	res.locals.expose = {exists: passin};
	// WARN: IS THIS NECESSARY?
	res.locals.session = req.session;
	res.locals.user = req.user;
	req.db = db;

	next();
});

// Readings to understand passport.js
// http://toon.io/understanding-passportjs-authentication-flow/
// https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pollindex);
app.use('/polls', pollindex);
app.use('/pollroute', pollroute);
app.use('/poll', poll);
app.use('/register', register);
app.use('/exportpolljson', exportpolljson);
app.use('/viewpolljson', viewpolljson);

//STUB: MOVE TO ANOTHER FILE LATER
app.get('/meta-login', function(req, res) {
	res.render('meta-login');
});

app.get('/nickname-login', function(req, res) {
	res.render('meta-login');
});

//app.post('/anonymous-login', function(req, res) {
//	res.render('meta-login');
//})

app.get('/', function(req, res) {
	res.render('index', { user: req.user});
});

app.get('/account', /*ensureAuthenticated,*/ function(req, res) {
	res.render('account', { user: req.user });
});

app.get('/login', function(req, res) {
	res.render('login', { user: req.user});
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.post('/login', function(req, res, next) {
	// THIS NEEDS TO BE SESSION-IZED
	console.log('By the way, redirect is set to:'+ req.session.redirect_to+' .');
	console.log('If this ever looks like it\'ll go to /login, please set to / instead.');
	var redirect_to = req.session.redirect_to || '/';
	//delete req.session.redirect_to;

	console.log('login matched with username '+req.body.username+' and password '+req.body.password+'.');
	passport.authenticate('local', function(err, user, info) {
		//console.log('Start login attempt.');
		if (err) { return next(err); }
		if (!user) {
			//console.log('User login failed.');
			return res.send({ success: false, message: info});
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			//console.log('User login successful.');
			return res.send({success: true, redirect: String(redirect_to)});
		});
	})(req, res, next);
});

app.post('/anonymous-login', function(req, res, next) {
	// THIS NEEDS TO BE SESSION-IZED
	console.log('By the way, redirect is set to:'+ req.session.redirect_to+' .');
	console.log('If this ever looks like it\'ll go to /login, please set to / instead.');
	var redirect_to = req.session.redirect_to || '/';
	//delete req.session.redirect_to;
	console.log('POST to anonymous-login.');
	passport.authenticate('anonymous');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect(200, '/');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	//console.log(util.inspect(req.url.slice(-3)));
	var err = new Error('Not Found\n'+'req: '+req.originalUrl);
	console.log('404 on originalUrl:' + req.originalUrl);
	console.log('404 on path:' + req.path.split('/').pop());
	if( (req.path.split('/').pop().slice(-3) === '.js' && passin[req.path.split('/').pop()]) ||
		(req.path.split('/').pop().slice(-4) === '.css' && passin[req.path.split('/').pop()]) ) {
		console.log(req.path.split('/').pop()+' was requested but not found; marked as no longer available.');
		passin[req.path.split('/').pop()] = false;
		next();
	}
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