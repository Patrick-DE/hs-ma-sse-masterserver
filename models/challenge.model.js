var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var challengeSchema = new Schema({
    points: { type: Number, required: true},
    activated: { type: Boolean, required: true, default: false},
    name: { type: String, required: true},
    url: { type: String, required: true},
    description: String,
    flag: { type: String, select: false, unique: true },
    solved_by: [ {type: mongoose.Schema.ObjectId, ref: 'teams'} ]
});

var Challenge = mongoose.model('challenges', challengeSchema);
module.exports = Challenge;
