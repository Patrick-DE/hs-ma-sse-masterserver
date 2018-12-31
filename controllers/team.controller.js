var mongoose = require('../dbconnection');

var Team = require('../models/team.model');
var User = require('../models/user.model');
var Challenge = require('../models/challenge.model');

// Display list of all teams.
exports.team_list = function(req, res) {
    Team.find(function (err, teams) {
        if (err) return res.status(500).send(err.message);
        res.json(teams);
    });
};

// Display detail page for a specific team.
exports.team_detail = function(req, res) {
    var id = req.params.id;
    Team.findById(id).populate('members', '-email').exec(function (err, team) {
        if (err) return res.status(500).send(err.message);
        res.status(200).json(team);
    });
};

// Handle team create on POST.
exports.team_create = function(req, res, next) {
    var newTeam = new Team(req.body);
    newTeam.members[0] = req.userId;
    newTeam.save(function(err) {
        if (err) return res.status(500).send(err.message);
        res.status(201).send(newTeam);
    });
};

// Handle team delete on POST.
exports.team_delete = function(req, res, next) {
    getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send(err.message);
        
        Team.findByIdAndDelete(team_id, function(err, team){
            if (err) return res.status(500).send(err.message);
            res.send(team);
        });
    });
};

// Handle team update on POST.
exports.team_update = function(req, res, next) {
    if(req.body.members !== undefined) delete req.body.members;

    getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send(err.message);

        Team.findByIdAndUpdate(team_id, req.body, {new: true}, function(err, team){
            if (err) return res.status(500).send(err.message); //TODO: CHECK WHAT IS ALLOWED TO BE CHANGED!!
            res.send(team);
        });
    })
};

// Add members to team
// Handle team update on POST.
exports.team_add_member = function(req, res, next) {
    getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({submit: false, message: "Error while processing your team. Please report back!"});
        if (!team_id) return res.status(400).send({submit: false, message: "Please join a team."});

        User.findById(req.body.id, function(err, user){
            if (err) return res.status(500).send({submit: false, message: "Error while processing your added user. Please report back!"});
            if (!user) return res.status(400).send({submit: false, message: "User "+req.body.id+" does not exist."});

            Team.findByIdAndUpdate(team_id, {
                $addToSet: { 
                    members: user._id
                }
            }, {new: true}).exec(function(err, team){
                if (err) return res.status(500).send(err.message);
                res.send(team);
            });
        })
    });
};

// Add members to team
// Handle team update on POST.
exports.team_delete_member = function(req, res, next) {
    getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({submit: false, message: "Error while processing your team. Please report back!"});
        if (!team_id) return res.status(400).send({submit: false, message: "Please join a team."});

        Team.findByIdAndUpdate(team_id, {
            $pull: { 
                members: req.params.id
            }
        }, {new: true}).exec(function(err, team){
            if (err) return res.status(500).send(err.message);
            res.send(team);
        });
    });
};

// Submit flag via POST.
exports.team_submit_flag = function(req, res, next) {
    Challenge.findOne( {flag: req.body.flag }, function(err, challenge){
        if (err) return res.status(500).send({submit: false, message: "Error while processing the challenge. Please report back!"});
        if (!challenge){
            return res.status(400).send({submit: false, message: "You submitted an invalid flag!"});
        }else{
            getTeamId(req.userId, function(err, team_id){
                if (err) return res.status(500).send({submit: false, message: "Error while processing your team. Please report back!"});
                if (!team_id) return res.status(400).send({submit: false, message: "Please join a team."});

                Team.findByIdAndUpdate(team_id, {
                    $addToSet: { 
                        solved_challenges: challenge._id
                    }
                },{new: true}).exec(function(err, team){
                    if (err || !team) return res.status(500).send({submit: false, message: "Error while saving the flag. Please report back!"});
                    
                    return res.status(200).send({submit: true, team: team});
                })
            });
            /*Team.findOne({'members': req.userId}, {$set: { 'members.$[]' : req.userId}}).exec(function(err, team){
                console.log(err);
                console.log(team);
            })*/
            /*Team.findOneAndUpdate( {
                members: mongoose.Types.ObjectId(req.userId)
            }, { 
                $push: { 
                    solved_challenges: challenge._id
                }
            }).exec(function(err, team){
                console.log(err);
                if (err) return res.status(500).send({submit: false, message: "Error while saving the flag. Please report back!"});
                if (!team) return res.status(500).send({submit: false, message: "Please join a team to submit a flag."});

                return res.status(200).send({submit: true, message: "Submission successful!"});
            });*/
        }
    });
};

function getTeamId(userId, callback){
    Team.find(function(err, team){
        var team_id = 0;
        if (!err){
            team.forEach(element => {
                element.members.forEach(member => {
                    if(member.equals(mongoose.Types.ObjectId(userId))) team_id = element._id;
                })
            });
        }
        callback(err, team_id);
    });
}