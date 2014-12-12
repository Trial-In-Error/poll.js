var express = require('express');
var session = require('express-session');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var compression = require('compression');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var strings = require('./bin/stringResources');
var LocalStrategy = require('passport-local').Strategy;
var Chance = require('chance');
var alea = new Chance();
var bcrypt = require('bcryptjs');
var helper = require('./bin/helper');
var redis = require('redis');
var url = require('url');
var redisURL;
if(process.env.REDISCLOUD_URL) {
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisURL.auth = redisURL.auth.split(":")[1]
} else {
	redisURL = { port: 6379, hostname: '127.0.0.1', auth: null };
};
var redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
redisClient.auth(redisURL.auth);
var redisStore;

// This function retries the connection to Redis every 5 minutes.
function redisRetry() {
	setTimeout(function() {
		redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
		redisClient.auth(redisURL.auth);
		redisSetup(redisClient);
	}, 300000);
}

// This function takes a redisClient object in and sets up its error & connect
// handlers. It then see-saws: every error causes it to end that object and
// make a new one 5 minutes later, calling this same function to reconfigure the
// new instance's error and connect handlers.
function redisSetup(redisClient) {
	redisClient.on('error', function(err) {
		console.log('REDIS: Connection failed.');
		redisClient.end();
		// This is a dirty, filthy hack.
		// It searches the app's router for the 'session' route;
		// it then replaces the session handler with one that uses memoryStore
		// because the redisStore is not reachable.
		for(element in app._router.stack) {
			if(app._router.stack[element].handle.name === 'session') {
				console.log('REDIS: Express no longer using Redis session store.');
				app._router.stack[element].handle = session({
					resave: true, //don't save session if unmodified
					saveUninitialized: true, //don't create session until something stored
					secret: "THISMUSTNOTCHANGE",
					cookie: {
						maxAge: 604800 //one week
					}
				});
				redisRetry();
			}
		}
	});
	redisClient.on('connect', function(err) {
		console.log('REDIS: Connected.');
		// This is also the same dirty, filthy hack except that it replaces
		// the session handler with one that uses the redisStore.
		for(element in app._router.stack) {
			if(app._router.stack[element].handle.name === 'session') {
				console.log('REDIS: Express now using Redis session store.');
				app._router.stack[element].handle = session({
					resave: true, //don't save session if unmodified
					saveUninitialized: true, //don't create session until something stored
					store: new RedisStore({
						client: redisClient
					}),
					secret: "THISMUSTNOTCHANGE",
					cookie: {
						maxAge: 604800 //one week
					}
				});
				RedisStore = require('connect-redis')(session);	
			}
		}
	});
}

// Set the first redisClient object up with the proper event handlers from above
redisSetup(redisClient);

// Then set it up for use with the session handler.
try {
	RedisStore = require('connect-redis')(session);		
} catch (err) {

}


// Database
var mongo = require('mongoskin');
// Use the remote mongo database if available (i.e., app is heroku hosted), else use the local one named 'polljs'
var db = mongo.db(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polljs', {native_parse:true});
// Mongo's GridFS allows for reading/writing larger files and streaming them
// The verdict? Will not implement. 
// Read more:
// http://stackoverflow.com/questions/4667597/understanding-mongodb-bson-document-size-limit
// http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle2.html
// http://mongodb.github.io/node-mongodb-native/api-generated/grid.html
// http://blog.james-carr.org/2012/01/09/streaming-files-from-mongodb-gridfs/
// https://blog.compose.io/gridfs-and-mongodb-pros-and-cons/
//var Grid = mongo.Grid;
//var grid = new Grid(db, 'fs');

var pollIndex = require('./routes/pollIndex');
var pollRoute = require('./routes/pollRoute');
var poll = require('./routes/poll');
var register = require('./routes/register');
var exportPoll = require('./routes/exportPoll');
var inspectPoll = require('./routes/inspectPoll');
var importPoll = require('./routes/importPoll');
var pollOverview = require('./routes/pollOverview');
var pollGrid = require('./routes/pollGrid');
var login = require('./routes/login');
var metaLogin = require('./routes/metaLogin');
var nicknameLogin = require('./routes/nicknameLogin');
var logout = require('./routes/logout');
var createPoll = require('./routes/createPoll');
var anonymousLogin = require('./routes/anonymousLogin');

// In prior versions of Express, this was a call to express.createServer();
// To support https, this will have to change.
// WARN: Support HTTPS by changing this as per:
// https://github.com/strongloop/express/wiki/Migrating-from-2.x-to-3.x
// http://www.hacksparrow.com/express-js-https.html
// http://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
// http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server
// http://stackoverflow.com/questions/11744975/enabling-https-on-express-js
var app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(compression({
  threshold: 512
}));

var exists_list = {};
var build_min_list = require('./bin/build_min_list.js');
var printList = helper.buildPrintList;
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
	//console.log('deserialize found: '+user);
	done(null, user);
	//done(err, user);
	//});
});

function findByNickname(nickname, fn) {
	db.collection('userdb').findOne({'type.nickname.nickname': String(nickname)}, function (err, user) {
		if(err) return err;
		if(user) {
			return fn(null, user);
		} else {
			return fn(null, null);
		}
	});
}

function newNicknameUser(name, pass) {
	// Creates a nickname user object
	user = {type: {nickname: {nickname: name}}, rights:{answer: true}};
	return user;
}

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use('local', new LocalStrategy(
	function(username, password, done) {
		console.log('Authenticating user.');
		// asynchronous verification, for effect...
		process.nextTick(function () {
			console.log('Tick.');
			helper.findByUsername(username, db, function(err, user) {
				console.log('localStrategy found: '+user);
				console.log(user);
				if (err) {return done(err);}
				if (!user) {
					return done(null, false, {message: strings('english', 'usernameNotFound', username)});
				}
				bcrypt.compare(password, user.type.login.passhash, function(err, res) {
					if(res) {
						return done(null, user);
					} else {
						return done(null, false, {message: strings('english', 'badPassword')});
					}
				});
			});
		});
	}
));

passport.use('nickname', new LocalStrategy(
	function(username, password, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			findByNickname(username, function(err, user) {
				if (err) {return done(err);}
				if (!user) {
					user = newNicknameUser(username);
					db.collection('userdb').insert(user, function(err, result) {
						if(err) { console.log(err); }
					});
				}
				return done(null, user);
			});
		});
	}
));

passport.use('anonymous', new LocalStrategy(
	function(username, password, done) {
		console.log('Logging in anonymous user.');
		// asynchronous verification, for effect...
		process.nextTick(function () {
			return done(null, {type: 'anonymous', rights: {answer: true}});
		});
	}
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser({limit: '5mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// session() must be called before passport.session()!
app.use(session({
	resave: true, //don't save session if unmodified
	saveUninitialized: true, //don't create session until something stored
	store: new RedisStore({
		client: redisClient
	}),
	secret: "THISMUSTNOTCHANGE",
	cookie: {
		maxAge: 604800 //one week
	}
}));

app.use(express.static(path.join(__dirname, 'public')));

// WARN: THE API SERVER DOES SESSION-BASED AUTH!!!
app.use(function(req, res, next) {
	// auth is in base64(username:password)  so we need to decode the base64
	var auth = req.headers.authorization;
	console.log('Authorization Header is: ', auth);
	console.log(req.body);
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

app.use(function(req, res, next) {
	res.locals.expose.auth = req.isAuthenticated();
	console.log('RES.LOCALS.EXPOSE.AUTH = '+req.isAuthenticated());
	next();
});

app.use('/', pollIndex);
app.use('/polls', pollIndex);
app.use('/pollroute', pollRoute);
app.use('/poll', poll);
app.use('/register', register);
app.use('/exportpoll', exportPoll);
app.use('/viewpoll', inspectPoll);
app.use('/inspectPoll', inspectPoll);
app.use('/importpoll', importPoll);
app.use('/pollOverview', pollOverview);
app.use('/grid', pollGrid);
app.use('/login', login);
app.use('/meta-login', metaLogin);
app.use('/nickname-login', nicknameLogin);
app.use('/createpoll', createPoll);
app.use('/logout', logout);
app.use('/anonymous-login', anonymousLogin);

app.get('/', function(req, res) {
	res.render('index', { user: req.user});
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
		//if(req.api) {
			console.log('Normal development error.');
			res.render('error', {
				message: err.message,
				//WARN CHANGE BACK TO {}
				error: {}
			});
		//} else {
		//	console.log('API development error.');
		//	res.status(err.status || 500).send({
		//		message: '',//'error: '+err.message,
		//		// WARN CHANGE BACK TO {}
		//		error: err
		//	});
		//}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	if(req.api) {
		console.log('Normal error.');
		res.render('error', {
			message: err.message,
			//WARN CHANGE BACK TO {}
			error: {}
		});
	} else {
		console.log('API error.');
		res.status(err.status || 500).send({
			message: '',//'error: '+err.message,
			// WARN CHANGE BACK TO {}
			error: err
		});
	}
});


module.exports = app;