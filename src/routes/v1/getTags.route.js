const express = require('express');

const router = express.Router();

const tagsController = require('../../controllers/v1/getTags.controller');

router.get('/', tagsController);

module.exports = router;
