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
		if (err) return res.status(500).send({ err: 'Error on the server.'});
		if (!user) return res.status(400).send({ err: 'No matching user found.'});
		if (user.blocked) return res.status(403).send({ err: 'You have been blocked for violating the rules!'});
		
		// check if the password is valid
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(400).send({ err: "No matching user found." });

		// if user is found and password is valid
		var token = create_token(user, req.ip);

		// return the information including token as JSON
		res.append("set-cookie", exports.setCookie("token", token, 1)).redirect("/scoreboard.html");
	});
};


exports.user_logout = function (req, res) {
	res.append("set-cookie", exports.setCookie("token", null, 1)).redirect("/login.html");
};


exports.user_register = function (req, res) {
	//USED FOR CHALLENGE - register and login
	UserController.user_create(req, function(err, user){
		if (err && err.code === 11000){
			return res.status(400).send({ err: "User already exists." });
		}else if(err){
			return res.status(500).send({ err: "There was a problem registering the user." });
		}
		// if user is registered without errors create a token
		var token = create_token(user, req.ip);

		res.status(201).send();
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

exports.setCookie = function(cname, cvalue, exhour) {
    var d = new Date();
    d.setTime(d.getTime() + (exhour*60*60*1000));
    var expires = "expires="+ d.toUTCString();
	return cname + "=" + cvalue + ";" + expires + ";path=/";
}