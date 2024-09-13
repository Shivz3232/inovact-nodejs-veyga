const express = require('express');

const userController = require('../../controllers/v2/user.controller');

const { fetchUserSanitizer } = require('../../controllers/v2/user.controller/sanitizer');

const router = express.Router();

router.get('/', fetchUserSanitizer, userController.fetchUser);

module.exports = router;
