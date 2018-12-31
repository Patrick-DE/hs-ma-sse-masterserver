var User = require('../models/user.model');
var bcrypt = require('bcryptjs');

//NOT EXPOSED, called from auth.controller
// Handle user create. 
exports.user_create = function(req, callback) {
    var newUser = new User(req.body);
    if (newUser.admin !== undefined) delete newUser.admin;
    if (newUser.blocked !== undefined) delete newUser.blocked;

    newUser.password = bcrypt.hashSync(req.body.password, 7);
    
    newUser.save(function(err) {
        callback(err, newUser);
    });
};

// Display detail page for a specific user.
exports.user_detail = function(req, res, next) {
    User.findById(req.userId, function (err, user) {
        if (err) return res.status(500).send(err.message);
        res.json(user);
    })
};

// Handle user delete on DELETE. 
exports.user_delete = function(req, res, next) {
    User.findByIdAndDelete(req.userId, function(err, user){
        if (err) return res.status(500).send(err.message);
        res.send(user);
    })
};

// Handle user update on PUT.
exports.user_update = function(req, res, next) {
    //remove all contents which should not be modified
    if (req.body.admin !== undefined) delete req.body.admin;

    User.findByIdAndUpdate(req.userId, req.body, {new: true}, function(err, user){
        if (err) return res.status(500).send(err.message);
        res.send(user);
    })
};