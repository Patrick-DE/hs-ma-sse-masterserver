var express = require('express');
var router = express.Router();

var challenge_controller = require('../controllers/challenge.controller');

//Get all challenges
router.get('/', challenge_controller.challenge_list);

//Get challenge status
router.get('/:id', challenge_controller.challenge_detail);

//submit new challenge
router.post('/', challenge_controller.challenge_create);

//Update a challenge
router.put('/:id', challenge_controller.challenge_delete);

//Delete a challenge
router.delete('/:id', challenge_controller.challenge_update);

module.exports = router;
