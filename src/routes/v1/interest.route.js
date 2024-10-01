const router = require('express').Router();
const interestController = require('../../controllers/v1/interest.controller');

router.get('/', interestController);

module.exports = router;
