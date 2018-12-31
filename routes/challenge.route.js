var express = require('express');
var router = express.Router();

var challenge_controller = require('../controllers/challenge.controller');
var Verify = require('../verifyToken');

//Get all challenges
router.get('/', Verify.Token, challenge_controller.challenge_list);

//Get challenge status
router.get('/:id', Verify.Token, challenge_controller.challenge_detail);

module.exports = router;
