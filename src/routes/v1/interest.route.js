const router = require('express').Router();
const interestController = require('../../controllers/interest.controller');

router.get('/', interestController);

module.exports = router;
