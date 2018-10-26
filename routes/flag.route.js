var express = require('express');
var router = express.Router();

var flag_controller = require('../controllers/flag.controller');

//Get all flags
router.get('/', flag_controller.flag_list);

//Get flag status
router.get('/:id', flag_controller.flag_detail);

//submit new flag
router.post('/', flag_controller.flag_create);

//Update a flag
router.put('/:id', flag_controller.flag_delete);

//Delete a flag
router.delete('/:id', flag_controller.flag_update);

module.exports = router;
