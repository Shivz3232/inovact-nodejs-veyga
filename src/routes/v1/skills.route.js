const router = require('express').Router();
const skillController = require('../../controllers/skills.controller');

router.get('/', skillController);

module.exports = router;
