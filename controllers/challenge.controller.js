var Challenge = require('../models/challenge.model');

// Display list of all buddies.
exports.challenge_list = function(req, res) {
    Challenge.find(function (err, buddies) {
        if (err) return console.error(err);
        res.json(buddies);
    })
};

// Display detail page for a specific challenge.
exports.challenge_detail = function(req, res) {
    var id = req.params.id;
    Challenge.findById(id, function (err, challenge) {
        if (err) return console.error(err);
        res.json(challenge);
    })
};

// Handle challenge create on POST.
exports.challenge_create = function(req, res) {
    var newChallenge = new Challenge({
        moodle_id: req.body.moodle_id,
        name: req.body.name,
        surename: req.body.surename,
        mobile: req.body.mobile,
        email: req.body.email,
    })
    newChallenge.save(function(err) {
        if (err) return console.error(err);
        req.send("Challenge " + newChallenge.name + " " + newChallenge.surename + " was added!");
    });
};

// Handle challenge delete on POST.
exports.challenge_delete = function(req, res) {
    Challenge.findByIdAndDelete(id, function(err, challenge){
        if (err) return console.error(err);
        res.send("Challenge " + challenge.name + " " + challenge.surename + " was deleted!");
    })
};

// Handle challenge update on POST.
exports.challenge_update = function(req, res) {
    Challenge.findByIdAndUpdate(id, req.body, function(err, challenge){
        if (err) return console.error(err);
        res.send("Challenge " + challenge.name + " " + challenge.surename + " was updated!");
    })
};