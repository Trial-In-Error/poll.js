exports.ensureAuth = function(req, res, next) {
	var passport = require('passport');

	var priv = req.priv;
	//req.priv = undefined;
	console.log('ensureAuth passport user: '+res.locals.session.passport.user);
	try {
		if (req.isAuthenticated() && typeof res.locals.session.passport.user.rights[priv] !== 'undefined' && res.locals.session.passport.user.rights[priv]) {
			console.log('User is already authenticated. Continuing.');
			return next();
		}// else {

			//console.log('ELSE, MOTHERFUCKER');
			//console.log(JSON.stringify(req.header(username)))
			//console.log(JSON.stringify(req.header(password)))
			console.log(req.isAuthenticated());
			passport.authenticate('local', function(err, user, info) {
				console.log('Start login attempt.');
				if (err) { return next(err); }
				if (!user) {
					//console.log('User login failed.');
					//return res.send({ success: false, message: info});
					return res.redirect('/login');
				}
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					//console.log('User login successful.');
					//return res.send({success: true, redirect: String(redirect_to)});
					return next();
				});
			})(req, res, next);

		//console.log('REQ.PATH = '+req.path);
		//if(req.path === '/login') {
		//	req.session.redirect_to = req.session.redirect_to || '/';
		//} else {
		//	//console.log('REQ.PATH: '+req.path);
		//	//console.log('REQ.ORIGINALURL: '+req.originalUrl);
		//	//console.log('REQ.BASEURL: '+req.baseUrl);
		//	req.session.redirect_to = req.originalUrl;
		//}
		//console.log('User is not already authenticated. Redirecting.');
		////req.session.returnTo = req.path;
		//res.redirect('/login');
	} catch (err) {
		console.log(err);
	}
};

exports.reqAnswerRight = function(req, res, next) {
	req.priv = 'answer';
	return next();
};

exports.reqGetAnswersRight = function(req, res, next) {
	req.priv = 'getAnswers';
	return next();
};

exports.reqOpenCloseRight = function(req, res, next) {
	req.priv = 'openClose';
	return next();
};

exports.reqDeleteRight = function(req, res, next) {
	req.priv = 'delete';
	return next();
};

exports.reqCreateRight = function(req, res, next) {
	req.priv = 'create';
	return next();
};

exports.build_combined_csv = function(questionCounter) {
	var csv_rows = [ [], [], [], [], [], [] ];
	var final_csv = '';
	//console.log('start');
		for (var responseCounter in poll.question_list[questionCounter].type.response_list) {
		//console.log('response counter'+responseCounter);
			res = poll.question_list[questionCounter].type.response_list[responseCounter];
			//console.log('res'+JSON.stringify(res));
			for (var answerCounter in res.answers) {
				var res2 = res.answers[answerCounter];
				//console.log('res2'+res2);
				csv_rows[0].push(res2.user);
				csv_rows[1].push(res2.timestamp);
				csv_rows[2].push(res2.skipped);
				csv_rows[3].push(responseCounter);
				csv_rows[4].push(res2.value);
				csv_rows[5].push(res2.explanation);
			}
		}
		//console.log('end');
	for (var row in csv_rows) {
		var thisRow = csv_rows[row];
		//console.log('thisRow' + thisRow);
		csv_rows[row] = JSON.stringify(thisRow).slice(1, -1);
		//console.log('thisRow, string' + csv_rows[row]);
		final_csv += csv_rows[row]+'\n';
	}
	return {final_csv: final_csv, csv_rows:csv_rows};
};

exports.frequencyCount = function(questionCounter) {
	// Makes an object that doesn't inherit from Object.prototype.
	// This makes it safe to use as an array.
	// See: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
	var dict = Object.create(null);
	for (var responseCounter in poll.question_list[questionCounter].type.response_list) {
	console.log('response counter'+responseCounter);
		res = poll.question_list[questionCounter].type.response_list[responseCounter];
		console.log('res'+JSON.stringify(res));
		for (var answerCounter in res.answers) {
			var res2 = res.answers[answerCounter];
			if(typeof dict[responseCounter] === 'undefined') {
				dict[responseCounter] = Object.create(null);
				dict[responseCounter].value = res2.value;
				if (typeof res2.explanation !== 'undefined' && typeof res2.explanation.explain_text !== 'undefined') {
					dict[responseCounter].explanation = [res2.explanation.explain_text];	
				}
				dict[responseCounter].response = res.body;
				dict[responseCounter].frequency = 1;
			} else {
				dict[responseCounter].value = res2.value;
				if (typeof res2.explanation !== 'undefined' && typeof res2.explanation.explain_text !== 'undefined') {
					dict[responseCounter].explanation.push(res2.explanation.explain_text);
				}
				dict[responseCounter].response = res.body;
				dict[responseCounter].frequency += 1;
			}
		}
	}
	return dict;
};

//WARN: NOT SAFE FOR RESPONSES WITH COMMAS IN THEM
exports.formatFrequencyCount = function(frequencyDict) {
	var csv = ''
	for (var counter in frequencyDict) {
		console.log(frequencyDict[counter])
		csv += '"' + frequencyDict[counter].response + '", ';
		csv += frequencyDict[counter].frequency + '\n';
	}
	return csv.slice(0,-1);
}