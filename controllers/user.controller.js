var User = require('../models/user.model');
var Team = require('../models/team.model');
var bcrypt = require('bcryptjs');

//for user_detail team_id
var TeamController = require('./team.controller');

//NOT EXPOSED, called from auth.controller
// Handle user create. 
exports.user_create = function(req, callback) {
    var newUser = new User(req.body);
    if (newUser.surname === undefined) newUser.surname = "";
    if (newUser.admin !== undefined) delete newUser.admin;
    if (newUser.blocked !== undefined) delete newUser.blocked;
    if (newUser.team !== undefined) delete newUser.team;

    newUser.password = bcrypt.hashSync(req.body.password, 7);
    
    newUser.save(function(err) {
        callback(err, newUser);
    });
};

// Display detail page for a specific user.
exports.user_detail = function(req, res, next) {
    User.findById(req.userId).select("+surname").exec(function (err, user) {
        if (err) return res.status(500).send({ err: err.message });
        TeamController.getTeamId(req.userId, function(err, team_id){
            if (err) return res.status(500).send({ err: err.message });
            res.send({user: user, team_id: team_id});
        });
    });
};

// Handle user delete on DELETE. 
exports.user_delete = function(req, res, next) {
    User.findByIdAndDelete(req.userId, function(err, user){
        if (err) return res.status(500).send({ err: err.message });
        res.send(user);
    });
};

// Handle user update on PUT.
exports.user_update = function(req, res, next) {
    //remove all contents which should not be modified
    if (req.body.admin !== undefined) delete req.body.admin;
    if (req.body.blocked !== undefined) delete req.body.blocked;

    User.findByIdAndUpdate(req.userId, req.body, {new: true}, function(err, user){
        if (err) return res.status(500).send({ err: err.message });
        res.send(user);
    });
};