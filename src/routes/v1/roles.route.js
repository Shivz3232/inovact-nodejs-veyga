const router = require('express').Router();

const rolesController = require('../../controllers/v1/roles.controller');

router.get('/', rolesController);

module.exports = router;
