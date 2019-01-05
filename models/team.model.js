var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var teamSchema = new Schema({
    sse_participants: { type: Boolean, required: true, default: false, select: false},
    on_site: { type: Boolean, required: true, default: false},
    country: { type: String, required: true},
    name: { type: String, require: true, unique: true},
    solved_challenges: [ {type: mongoose.Schema.ObjectId, ref: 'challenges'} ],
    members: [ { type: mongoose.Schema.ObjectId, ref: 'users'} ],
    team_points: { type: Number, default: 0 }
});

var Team = mongoose.model('teams', teamSchema);
module.exports = Team;
