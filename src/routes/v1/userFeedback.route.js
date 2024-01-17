const express = require('express');
const userFeedbackController = require('../../controllers/userFeedback.controller/');
const { addUserFeedbackSanitizer, getUserFeedbackSanitizer } = require('../../controllers/userFeedback.controller/sanitizer');

const router = express.Router();

router.get('/', getUserFeedbackSanitizer, userFeedbackController.getUserFeedback);
router.post('/', addUserFeedbackSanitizer, userFeedbackController.addUserFeedback);

module.exports = router;
