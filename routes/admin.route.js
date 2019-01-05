var express = require('express');
var router = express.Router();

var admin_controller = require('../controllers/admin.controller');
var Verify = require('../verifyToken');

// user controlls
//============================================================

// Get all users
router.get('/user/', Verify.AdminToken, admin_controller.user_list);

// Get user status
router.get('/user/:id', Verify.AdminToken, admin_controller.user_detail);

// submit new user
router.post('/user/', Verify.AdminToken, admin_controller.user_create);

// Update a user
router.put('/user/:id', Verify.AdminToken, admin_controller.user_update);

// Delete a user
router.delete('/user/:id', Verify.AdminToken, admin_controller.user_delete);

// team controlls
//============================================================

// Get user status
router.get('/team/', Verify.AdminToken, admin_controller.team_list);

// Update a team
router.put('/team/:id', Verify.AdminToken, admin_controller.team_update);

// Delete a tean
router.delete('/team/:id', Verify.AdminToken, admin_controller.team_delete);

// challenge controlls
//============================================================

//submit new challenge
router.post('challenge/', Verify.AdminToken, admin_controller.challenge_create);

//Update a challenge
router.put('challenge/:id', Verify.AdminToken, admin_controller.challenge_update);

//Delete a challenge
router.delete('challenge/:id', Verify.AdminToken, admin_controller.challenge_delete);

module.exports = router;
