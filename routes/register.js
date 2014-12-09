var express = require('express');
var router = express.Router();
//var bcrypt = require('bcrypt-nodejs');
//var bcrypt = require('twin-bcrypt');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var helper = require('../bin/helper');
var strings = require('../bin/stringResources');
//var db = req.db;

/* GET registration page. */
router.get('/', function(req, res) {
	res.render('register', { title: strings('english', 'registerTitle'), globalExists: global });
});

function newUser(name, pass, fn) {
	// Store user, with username and hash in user DB.
	//console.log('newUser');
	console.log(typeof fn);
	bcrypt.genSalt(4, function(err, salt) {
		bcrypt.hash(pass, salt, function(err, hash) {
			console.log('PASSHASH!!!!! ' + hash);
			user = {type: {login: {username: name, passhash: hash}}, rights:{answer: true}};
			console.log('User: '+user);
			fn(null, user);
		});
	});
}

// STUB: SPECIAL CHARACTER VALIDATION
function validateRegistration(username, password) {
	//console.log(username+' '+username.length);
	//console.log(password+' '+password.length);
	var maxUsernameLength = 32;
	var maxPasswordLength = 32;

	if(username.length <= 0 && password.length > 0) {
		return 'Please fill in your username.';
	} else if (username.length > 0 && password.length <= 0) {
		return 'Please fill in your password.';
	} else if (password.length < 5 && username.length > 0) {
		return 'Please choose a password at least 5 characters long.';
	} else if (username.length > maxUsernameLength && password.length <= maxPasswordLength) {
		return 'Please choose a username shorter than '+maxUsernameLength+' characters.';
	} else if (username.length <= maxUsernameLength && password.length > maxPasswordLength) {
		return 'Please choose a password shorter than '+maxPasswordLength+' characters.';
	} else if (username.length > maxUsernameLength && password.length > maxPasswordLength) {
		return 'Please choose a username shorter than '+maxUsernameLength+' characters and a password shorter than '+maxPasswordLength+' characters.';
	} else if (username.length <= 0 && password.length <= 0) {
		return 'Please fill in your username and password.';
	} else if (!helper.checkAlphanumeric(username) || !helper.checkAlphanumeric(password)) {
		return 'Please only use alphanumeric characters in your username and password.';
	} else {
		return '';
	}
}

/* POST to register */
router.post('/', function(req, res) {
	console.log('--------------');
	var db = req.db;
	var validateError = validateRegistration(req.body.username, req.body.password);
	if(validateError !== '') {
		console.log('Error error!');
		return res.send(400, {msg: validateError});
	}
	helper.findByUsername(req.body.username, req.db, function(err, user) {
		console.log(user);
		if(user) {
			console.log('Shit, that user already exists.');
			return res.send(400, {msg: 'That username is already taken. Please choose another.'});
		} else {
			console.log('NEWLYLOL');
			newUser(req.body.username, req.body.password, function(err, result1) {
				db.collection('userdb').insert(result1, function(err, result) {
					console.log('User '+req.body.username+' added with password '+req.body.password+'.');
					passport.authenticate('local', function(err, user, info) {
						console.log('Start login attempt.');
						if (err) { return res.send(err); }
						if (!user) {
							console.log('User login failed.');
							return res.send(400, { msg: 'User login failed.'});
						}
						req.login(user, function(err) {
							if (err) { return res.send(err); }
							console.log('User login successful.');
							return res.send({msg: ''});
						});
					})(req, res);
				});
			});
		}
	});
});

module.exports = router;