var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user.controller');
var Verify = require('../verifyToken');

//Get my user
router.get('/', Verify.Token, user_controller.user_detail);

//Update my user
router.put('/', Verify.Token, user_controller.user_update);

//Delete my user
router.delete('/', Verify.Token, user_controller.user_delete);

module.exports = router;
