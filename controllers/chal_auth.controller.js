var User = require('../models/user.model');
var UserController = require('../controllers/user.controller');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');

exports.user_login = function (req, res) {
	//USED FOR CHALLENGE
	User.findOne({ alias: req.body.alias }).select("+password +admin +blocked").exec(function (err, user) {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No matching user found.');
		if (user.blocked) return res.status(403).send('You have been blocked for violating the rules!');
		
		// check if the password is valid
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

		// if user is found and password is valid
		var token = create_token(user, req.ip);

		// return the information including token as JSON
		//res.set('location', '/scoreboard');
		//res.status(301).send({ auth: true, token: token })
		res.status(200).send({ auth: true, token: token });
	});
};


exports.user_logout = function (req, res) {
	res.status(200).send({ auth: false, token: null });
};


exports.user_register = function (req, res) {
	//USED FOR CHALLENGE - register and login
	UserController.user_create(req, function(err, user){
		if (err && err.code === 11000){
			return res.status(400).send("User already exists.");
		}else if(err){
			return res.status(500).send("There was a problem registering the user.");
		}
		// if user is registered without errors create a token
		var token = create_token(user, req.ip);

		res.status(200).send({ auth: true, token: token });
	});
};

// not exposed //user by login,register
function create_token(user, ip){
	// create a token
	var token = jwt.sign({ id: user._id, ip: ip, admin: user.admin}, process.env.SECRET, {
		expiresIn: 3600//1h, 86400 expires in 24 hours
	});

	return token;
};