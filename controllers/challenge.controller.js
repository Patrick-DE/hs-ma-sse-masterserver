var Challenge = require('../models/challenge.model');

// Display list of all buddies.
exports.challenge_list = function(req, res, next) {
    Challenge.find(function (err, buddies) {
        if (err) return res.status(500).send(err.message);
        res.json(buddies);
    })
};

// Display detail page for a specific challenge.
exports.challenge_detail = function(req, res, next) {
    var id = req.params.id;
    Challenge.findById(id, function (err, challenge) {
        if (err) return res.status(500).send(err.message);
        res.json(challenge);
    })
};