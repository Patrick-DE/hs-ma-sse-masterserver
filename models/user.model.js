var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true},
    surename: String,
    alias: { type: String, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true, select: false}, //will not be returned!
    admin: { type: Boolean, require: true, default: false, select: false }, //will not be returned!
    blocked: { type: Boolean, required: true, default: false, select: false} //will not be returned!
});

var User = mongoose.model('users', userSchema);
module.exports = User