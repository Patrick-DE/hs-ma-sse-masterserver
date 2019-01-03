exports.index = function(req, res, next){
    res.render('pages/index');
};

exports.organizer = function(req, res, next){
    res.render('pages/organizer');
};

exports.login = function(req, res, next){
    res.render('pages/login');
};

exports.scoreboard = function(req, res, next){
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('pages/scoreboard', {
        drinks: drinks,
        tagline: tagline
    });
};

exports.team = function(req, res, next){
    res.render('pages/team');
};

exports.profile = function(req, res, next){
    res.render('pages/profile');
};
