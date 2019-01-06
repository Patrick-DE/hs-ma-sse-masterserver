var User = require('../models/user.model');
var Team = require('../models/team.model');
var Challenge = require('../models/challenge.model');
var bcrypt = require('bcryptjs');

// USER
//=======================================================

// Display list of all user.
exports.user_list = function(req, res, next) {
    User.find(function (err, users) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(users);
    })
};

// Display detail page for a specific user.
exports.user_detail = function(req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(user);
    })
};

// Handle user create. 
exports.user_create = function(req, res, next) {
    var newUser = new User(req.body);

    newUser.password = bcrypt.hashSync(req.body.password, 7);

    newUser.save(function(err) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(user);
    });
};

// Handle user delete on DELETE. 
exports.user_delete = function(req, res, next) {
    User.findByIdAndDelete(req.params.id, function(err, user){
        if (err) return res.status(500).send({ err: err.message });
        res.send(user);
    })
};

// Handle user update on PUT.
exports.user_update = function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user){
        if (err) return res.status(500).send({ err: err.message });
        res.send(user);
    })
};

// TEAM
//=======================================================

// Display list of all teams.
exports.team_list = function(req, res) {
    Team.find({}).select('+sse_participants').populate('solved_challenges').exec(function (err, teams) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(teams);
    });
};

// Handle team delete on DELETE.
exports.team_delete = function(req, res, next) {
    Team.findByIdAndDelete(req.params.id, function(err, team){
        if (err) return res.status(500).send({ err: err.message });
        res.send(team);
    });
};

// Handle team update on PUT.
exports.team_update = function(req, res, next) {
    if(req.body.members) delete req.body.members;

    Team.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, team){
        if (err) return res.status(500).send({ err: err.message }); //TODO: CHECK WHAT IS ALLOWED TO BE CHANGED!!
        res.send(team);
    });
};

// CHALLENGE
//=======================================================

// Handle challenge create on POST.
exports.challenge_create = function(req, res, next) {
    var newChallenge = new Challenge(req.body);
    newChallenge.save(function(err) {
        if (err) return res.status(500).send({ err: err.message });
        res.status(201).send(newChallenge);
    });
};

// Handle challenge delete on POST.
exports.challenge_delete = function(req, res, next) {
    Challenge.findByIdAndDelete(req.params.id, function(err, challenge){
        if (err) return res.status(500).send({ err: err.message });
        res.send(challenge);
    });
};

// Handle challenge update on POST.
exports.challenge_update = function(req, res, next) {
    Challenge.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, challenge){
        if (err) return res.status(500).send({ err: err.message });
        res.send(challenge);
    });
};

exports.challenge_activate = function(req, res, next) {
    Challenge.updateMany({activated: !req.body.status},{activated: req.body.status}).then(result => {
        if (result.ok !== 1) return res.status(500);
        res.status(200).send(result.nModified+" challenges were changed");
    });
};