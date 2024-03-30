const express = require('express');
const userActionController = require('../../controllers/userAction.controller/');
const { getUserActionsSanitizer, updateUserActionSanitizer } = require('../../controllers/userAction.controller/sanitizer');

const router = express.Router();

router.get('/', getUserActionsSanitizer, userActionController.getUserActions);
router.post('/', updateUserActionSanitizer, userActionController.updateUserActions);

module.exports = router;
