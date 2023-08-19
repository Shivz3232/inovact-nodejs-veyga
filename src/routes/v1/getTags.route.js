const express = require('express');

const router = express.Router();

const tagsController = require('../../controllers/getTags.controller');

router.get('/', tagsController);

module.exports = router;
