var Flag = require('../models/flag.model');

// Display list of all categories.
exports.flag_list = function(req, res) {
    Flag.find(function (err, categories) {
        if (err) return console.error(err);
        res.json(categories);
    })
};

// Display detail page for a specific flag.
exports.flag_detail = function(req, res) {
    var id = req.params.id;
    Flag.findById(id, function (err, flag) {
        if (err) return console.error(err);
        res.json(flag);
    })
};

// Handle flag create on POST.
exports.flag_create = function(req, res) {
    var newFlag = new Flag({
        flag_id: req.body.flag_id,
        name: req.body.name,
    })
    newFlag.save(function(err) {
        if (err) return console.error(err);
        req.send("Flag " + newFlag.name + " was added!");
    });
};

// Handle flag delete on POST.
exports.flag_delete = function(req, res) {
    Flag.findByIdAndDelete(id, function(err, flag){
        if (err) return console.error(err);
        res.send("Flag " + flag.name + " was deleted!");
    })
};

// Handle flag update on POST.
exports.flag_update = function(req, res) {
    Flag.findByIdAndUpdate(id, req.body, function(err, flag){
        if (err) return console.error(err);
        res.send("Flag " + flag.name + " was updated!");
    })
};