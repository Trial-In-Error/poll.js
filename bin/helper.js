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