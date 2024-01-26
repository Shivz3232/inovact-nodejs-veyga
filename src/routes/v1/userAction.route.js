const express = require('express');
const userActionController = require('../../controllers/userAction.controller/');
const { getTutorialStatusSanitizer, updateTutorialStatusSanitizer } = require('../../controllers/userAction.controller/sanitizer');

const router = express.Router();

router.get('/tutorialStatus', getTutorialStatusSanitizer, userActionController.getTutorialStatus);
router.post('/tutorialStatus', updateTutorialStatusSanitizer, userActionController.updateTutorialStatus);

module.exports = router;
