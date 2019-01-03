var User = require('./models/user.model');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.Token = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.headers['x-access-token'];
	if (!token){
		res.set('location', '/login');
   		return res.status(301).send({ auth: false, message: 'No token provided.' });
	}

	// verifies secret and checks exp
	jwt.verify(token, process.env.SECRET, function (err, decoded) {
		if (err){
			res.set('location', '/login');
   			return res.status(301).send({ auth: false, token: null, message: 'The token expired.' });
		}

		// check if token has client ip
		if (decoded.ip === undefined || req.ip !== decoded.ip){
			res.set('location', '/login');
			return res.status(301).send({ auth: false, token: null, message: 'Failed to authenticate token.' });
		}

		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;

		User.findById(req.userId).select("+blocked").exec(function (err, user) {
			if (err){
				res.set('location', '/login');
				return res.status(301).send({ auth: false, token: null, message: 'Failed to authenticate the user status.' });
			}			
			if (user.blocked){
				res.set('location', '/');
				return res.status(403).send({ auth: false, token: null, message: 'You have been blocked for violating the rules.' });
			}	
			next();
		});
	});
};

exports.AdminToken = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.headers['x-access-token'];
	if (!token)
		return res.status(403).send({ auth: false, message: 'No token provided.' });

	// verifies secret and checks exp
	jwt.verify(token, process.env.SECRET, function (err, decoded) {
		if (err) return res.status(500).send({ auth: false, token: null, message: 'Failed to authenticate token.' });

		// check if token has client ip
		if (decoded.ip === undefined || req.ip !== decoded.ip) return res.status(500).send({ auth: false, token: null, message: 'Failed to authenticate token.' });
		if (decoded.admin === undefined || req.admin === false) return res.status(403).send({ auth: false, token: null, message: 'Forbidden.' });

		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;
		
		User.findById(req.userId).select("+blocked").exec(function (err, user) {
			if (err)			return res.status(500).send({ auth: false, token: null, message: 'Failed to authenticate the user status.' });
			if (user.blocked)	return res.status(403).send({ auth: false, token: null, message: 'You have been blocked for violating the rules.' });
			next();
		});
	});
};