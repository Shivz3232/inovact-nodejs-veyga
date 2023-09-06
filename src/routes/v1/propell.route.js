const express = require('express');
const router = express.Router();
const fetchUserFromEmail = require('../../controllers/propell.controller/getUserByEmail/index');

const { fetchUserSanitizer } = require('../../controllers/propell.controller/sanitizer');

router.post('/getUser', fetchUserSanitizer, fetchUserFromEmail);

module.exports = router;
