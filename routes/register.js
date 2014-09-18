var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
//var db = req.db;

//WARN: THIS IS COMPLETELY REDUNDANT FROM APP.JS!!! DON'T BE LAZY!
function findByUsername(req, fn) {
	var db = req.db;
	// find().limit(1) SERVING AS findOne()
	// see: https://blog.serverdensity.com/checking-if-a-document-exists-mongodb-slow-findone-vs-find/
	// also see: http://stackoverflow.com/questions/22364858/pagination-in-mongoskin-skip-limit
	console.log('findByUsername req.username: '+req.body.username);
	db.collection('userdb').findOne({'type.login.username': String(req.body.username)}, function (err, user) {
		if(err) return err;
		if(user) {
			console.log('User found in database.');
			return fn(null, user);
		} else {
			console.log('User not found in database.');
			return fn(null, null);
		}
	});
}

/* GET registration page. */
router.get('/', function(req, res) {
	res.render('register', { title: 'Login', globalExists: global });
});

function newUser(name, pass) {
	// Store user, with username and hash in user DB.
	hash = bcrypt.hashSync(pass);
	user = {type: {login: {username: name, passhash: hash}}, rights:{answer: true}};
	console.log('User: '+user);
	return user;
}

/* POST to register */
router.post('/', function(req, res) {
	var db = req.db;
	findByUsername(req, function(err, user) {
		console.log(user);
		if(user) {
			console.log('Shit, that user already exists.');
			res.send({msg: 'That username is already taken. Please choose another.'});
		} else {
			db.collection('userdb').insert(newUser(req.body.username, req.body.password), function(err, result) {
					console.log('User '+req.body.username+' added with password '+req.body.password+'.');
					passport.authenticate('local', function(err, user, info) {
						console.log('Start login attempt.');
						if (err) { return res.send(err); }
						if (!user) {
							console.log('User login failed.');
							return res.send({ msg: 'User login failed.'});
						}
						req.login(user, function(err) {
							if (err) { return res.send(err); }
							console.log('User login successful.');
							return res.send({msg: ''});
						});
					})(req, res);
			});
		}
	});
});

module.exports = router;