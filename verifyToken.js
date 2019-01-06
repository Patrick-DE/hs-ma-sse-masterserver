var User = require('./models/user.model');
var Auth = require('./controllers/chal_auth.controller');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.Token = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var tokenHeader = req.headers.cookie;
	if (!tokenHeader) return res.status(403).send({ err: 'No token available, please login.'});
	var cookies = tokenHeader.split(';');

	var token = "null";
	cookies.forEach(function(elem, index){
		var tokens = elem.split('=');
		if(tokens[0].trim() === "token"){
			if(tokens[1].trim() !== undefined && tokens[1].trim() !== "null") token = tokens[1];
		}
	});
	if (token === "null") return res.status(403).send({ err: 'No token available, please login.'});

	// verifies secret and checks exp
	jwt.verify(token, process.env.SECRET, function (err, decoded) {
		if (err){
			return res.status(400).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'The token expired.'});
		}

		// check if token has user_id
		if (decoded.id === undefined) return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate token.'});
		// check if token has client ip
		if (decoded.ip === undefined || req.ip !== decoded.ip) return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate token.'});
		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;

		User.findById(req.userId).select("+blocked").exec(function (err, user) {
			if (err) 			return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate the user status.'});
			if (!user) 			return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'The user requested was deleted.'});
			if (user.blocked)	return res.status(403).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'You have been blocked for violating the rules.'});
			next();
		});
	});
};

exports.AdminToken = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var tokenHeader = req.headers.cookie;
	if (!tokenHeader) return res.status(403).send({ err: 'No token available, please login.'});
	var cookies = tokenHeader.split(';');

	var token = "null";
	cookies.forEach(function(elem, index){
		var tokens = elem.split('=');
		if(tokens[0].trim() === "token"){
			if(tokens[1].trim() !== undefined && tokens[1].trim() !== "null") token = tokens[1];
		}
	});
	if (token === "null") return res.status(403).send({ err: 'No token available, please login.'});

	// verifies secret and checks exp
	jwt.verify(token, process.env.SECRET, function (err, decoded) {
		if (err) return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate token.'});

		// check if token has user_id
		if (decoded.id === undefined) return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate token.'});
		// check if token has client ip
		if (decoded.ip === undefined || req.ip !== decoded.ip) return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate token.' });
		if (decoded.admin === undefined || req.admin === false) return res.status(403).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Forbidden.' });

		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;
		
		User.findById(req.userId).select("+blocked").exec(function (err, user) {
			if (err) 			return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate the user status.'});
			if (user.blocked)	return res.status(403).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'You have been blocked for violating the rules.'});
			next();
		});
	});
};