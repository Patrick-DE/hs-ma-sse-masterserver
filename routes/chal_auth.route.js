var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/chal_auth.controller');

//Register user only CHALLENGE
router.post('/register', auth_controller.user_register);

//Invalidate token
router.get('/logout', auth_controller.user_logout);

//If user exists, set valid token else create user (MOODLE)
//Set valid token if successfull (CHALLENGE)
router.post('/login', auth_controller.user_login);

module.exports = router;