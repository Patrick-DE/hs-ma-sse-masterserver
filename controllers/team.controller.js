var mongoose = require('../dbconnection');

var Team = require('../models/team.model');
var User = require('../models/user.model');
var Challenge = require('../models/challenge.model');

// Display list of all teams.
exports.team_list = function(req, res) {
    Team.find({}).populate('solved_challenges').sort({"team_points": -1}).exec(function (err, teams) {
        if (err) return res.status(500).send({ err: err.message });
        res.json(teams);
    });
};

// Display detail page for a specific team.
exports.team_detail = function(req, res) {
    exports.getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({ err: err.message });
        if (!team_id) return res.status(404).send({ err: "You are not part of a team. Create one or get invited."});

        Team.findById(team_id).populate('members').populate('solved_challenges').exec(function (err, team) {
            if (err) return res.status(500).send({ err: err.message });
            res.status(200).send(team);
        });
    });
};

// Handle team create on POST.
exports.team_create = function(req, res, next) {
    var newTeam = new Team(req.body);
    var tmp = exports.checkCityOrCountry(newTeam.country);
    if(tmp === "")
        return res.status(400).send({err: "Please enter a valid country (en). The full list can be found here: /resources/countries.json"});
    else
        newTeam.country = tmp;
    newTeam.members[0] = mongoose.Types.ObjectId(req.userId);
    newTeam.save(function(err, team) {
        if (err && err.code == 11000){
            return res.status(500).send({ err: "The team does already exist."});
        }else if(err){
            return res.status(500).send({ err: err.message });
        }
        res.status(201).send(team);
    });
};

// Handle team delete on POST.
exports.team_delete = function(req, res, next) {
    exports.getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({ err: err.message });
        if (!team_id) return res.status(500).send({ err: "No team found."});

        Team.findByIdAndDelete(team_id, function(err, team){
            if (err) return res.status(500).send({ err: err.message });
            res.status(200).send(team);
        });
    });
};

// Handle team update on POST.
exports.team_update = function(req, res, next) {
    if(req.body.name === undefined || req.body.country === undefined) return res.status(400).send({err: "Please enter the required data."});
    if(req.body.name.trim() === "" || req.body.country.trim() === "") return res.status(400).send({err: "Please enter the required data."});
    var tmp = exports.checkCityOrCountry(req.body.country);
    if(tmp === "")
        return res.status(400).send({err: "Please enter a valid country (en). The full list can be found here: /resources/countries.json"});
    else
        req.body.country = tmp;

    //update only name & country
    exports.getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({ err: err.message });

        Team.findByIdAndUpdate(team_id, {name: req.body.name, country: req.body.country}, {new: true}, function(err, team){
            if (err) return res.status(500).send({ err: err.message }); //TODO: CHECK WHAT IS ALLOWED TO BE CHANGED!!
            res.status(200).send(team);
        });
    })
};

// Add members to team
// Handle team update on POST.
exports.team_add_member = function(req, res, next) {
    exports.getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({ err: "Error while processing your team. Please report back!"});
        if (!team_id) return res.status(400).send({ err: "Please join a team."});

        User.findOne({ alias: req.body.alias}, function(err, user){
            exports.getTeamId(user._id, function(err, existingTeam_id){
                if(existingTeam_id === undefined){
                    Team.findByIdAndUpdate(team_id, {
                        $addToSet: { 
                            members: user._id
                        }
                    }, {new: true}).exec(function(err, team){
                        if (err) return res.status(500).send({ err: err.message });
                        res.status(201).send(team);
                    });
                }else{
                    res.status(400).send({ err: "This user is already a member of a team."});
                }
            });
        })
    });
};

// Add members to team
// Handle team update on POST.
exports.team_delete_member = function(req, res, next) {
    exports.getTeamId(req.userId, function(err, team_id){
        if (err) return res.status(500).send({ err: "Error while processing your team. Please report back!"});
        if (!team_id) return res.status(400).send({ err: "Please join a team."});

        User.findOne({alias: req.body.alias}, function(err, user){
            if (err) return res.status(500).send({ err: err.message });

            Team.findByIdAndUpdate(team_id, {
                $pull: { 
                    members: user.id
                }
            }, {new: true}).exec(function(err, team){
                if (err) return res.status(500).send({ err: err.message });
                res.status(200).send(team);
            });
        });
    });
};

// Submit flag via POST.
exports.team_submit_flag = function(req, res, next) {
    // check if flag exists
    Challenge.findOne( {flag: req.body.flag, activated: true }, function(err, challenge){
        if (err) return res.status(500).send({ err: "Error while processing the challenge. Please report back!"});
        if (!challenge){
            return res.status(400).send({ err: "You submitted an invalid flag!"});
        }else{
            /*var count = challenge.solved_by.length;
            var bonusDec = 0;
            if(count === 0)
                bonusDec = 50;
            else if(count === 1)
                bonusDec  = 25;
            else if(count === 2)
                bonusDec = 10;*/

            // what is the users team
            exports.getTeamId(req.userId, function(err, team_id){
                if (err) return res.status(500).send({ err: "Error while processing your team. Please report back!"});
                if (!team_id) return res.status(400).send({ err: "Please join a team."});
                if (challenge.provider === undefined) return res.status(500).send({ err: "The challenge is missing a provider."});
                var teamIdObject = mongoose.Types.ObjectId(team_id);
                if (challenge.provider.equals(teamIdObject)) return res.status(400).send({ err: "You are not allowed to submit your own flags."});
                
                // if user has a team update challenge
                Challenge.findOneAndUpdate({
                    $and: [
                        {_id: challenge._id},
                        {solved_by: 
                            { $ne: teamIdObject}
                        }
                    ]}, {
                    $addToSet: { 
                        solved_by: team_id
                    }
                }).exec(function(err, challenge){
                    if (err) return res.status(500).send({ err: "Error while registering points. Please report back!"});
                    if (!challenge) return res.status(400).send({ err: "You already submitted this flag."});
                    // if challenge was updated update team
                    Team.findByIdAndUpdate(team_id,{
                        $addToSet: { 
                            solved_challenges: challenge._id
                        },
                        $inc: {
                            team_points: challenge.points-(challenge.solved_by.length*5)//+bonusDec
                        }
                    },{new: true}).exec(function(err, team){
                        if (err || !team) return res.status(500).send({ err: "Error while saving the flag. Please report back!"});
                        
                        return res.status(201).send({submit: true, team: team});
                    });
                });
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

exports.getTeamId = function (userId, callback){
    Team.find(function(err, team){
        var team_id = undefined;
        if (!err){
            team.forEach(element => {
                element.members.forEach(member => {
                    //user: 5c300a02d58fa65d489326a5
                    //correct team: 5c3011bdd58fa65d489326a7
                    if(member.equals(mongoose.Types.ObjectId(userId))){
                        team_id = element.id;
                    }
                });
            });
        }
        callback(err, team_id);
    });
}

exports.checkCityOrCountry = function(name){
    const fs = require('fs');
    pfad = "../public/resources/countries.json";
    try{
        fs.existsSync(pfad);
    }catch(e){
        console.log("/resources/countries.json is missing!" + " - " + e.message);
    }
    const countries = require(pfad);
    var found = "";
    countries.forEach((country) => {
        if (country.name.toLowerCase() === name.toLowerCase() || country.code.toLowerCase() === name.toLowerCase()) {
            found = country.name;
        };
    });
    return found;
}