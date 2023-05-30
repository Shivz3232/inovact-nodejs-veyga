const router = require('express').Router();

const rolesController = require('../../controllers/roles.controller');

router.get('/', rolesController);

module.exports = router;
