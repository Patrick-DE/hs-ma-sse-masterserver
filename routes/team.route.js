var express = require('express');
var router = express.Router();

var team_controller = require('../controllers/team.controller');
var Verify = require('../verifyToken');

//Get all teams
router.get('/all', Verify.Token, team_controller.team_list);

//Get team status
router.get('/', Verify.Token, team_controller.team_detail);

//submit new team
router.post('/', Verify.Token, team_controller.team_create);

//Update a team //TODO: check if hes in team
router.put('/', Verify.Token, team_controller.team_update);

//Delete a team //TODO: check if hes in team
router.delete('/', Verify.Token, team_controller.team_delete);

//Submit a flag
router.post('/submit', Verify.Token, team_controller.team_submit_flag);

//add member
router.post('/member', Verify.Token, team_controller.team_add_member);

//remove member
router.delete('/member/:id', Verify.Token, team_controller.team_delete_member);

module.exports = router;
