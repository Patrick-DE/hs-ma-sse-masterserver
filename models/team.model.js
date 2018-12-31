var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var teamSchema = new Schema({
    sse_participants: { type: Boolean, required: true, default: false},
    on_site: { type: Boolean, required: true, default: false},
    country: { type: String, required: true},
    name: { type: String, require: true, unique: true},
    solved_challenges: [ {type: mongoose.Schema.ObjectId, ref: 'challenges'} ],
    members: [ {type: mongoose.Schema.ObjectId, ref: 'users'} ]
});


teamSchema
    .virtual('team_points')
    .get(function(){
        var totalPoints = 0;
        this.solved_challenges.forEach(element => {
            totalPoints += element.points;
        });
        return totalPoints;
    })

var Team = mongoose.model('teams', teamSchema);
module.exports = Team;
