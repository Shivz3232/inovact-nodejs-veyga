const express = require('express');
const router = express.Router();
const fetchUserFromEmail = require('../../controllers/v1/propell.controller/getUserByEmail/index');

const { fetchUserSanitizer } = require('../../controllers/v1/propell.controller/sanitizer');

router.post('/getUser', fetchUserSanitizer, fetchUserFromEmail);

module.exports = router;
