var Challenge = require('../models/challenge.model');

// Display list of all challenges.
exports.challenge_list = function(req, res, next) {
    Challenge.find({}).populate('solved_by').exec(function (err, challenges) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(challenges);
    })
};

// Display detail page for a specific challenge.
exports.challenge_detail = function(req, res, next) {
    var id = req.params.id;
    Challenge.findById(id, function (err, challenge) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(challenge);
    })
};