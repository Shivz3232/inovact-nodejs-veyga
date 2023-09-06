const router = require('express').Router();
const privateMessageController = require('../../controllers/privateMessage.controller');
const { getLatestMessageSanitizer, getUserMessagesSanitizer, sendMessageSanitizer } = require('../../controllers/privateMessage.controller/sanitizer');

router.post('/private', sendMessageSanitizer, privateMessageController.sendPrivateMessage);
router.get('/users', getUserMessagesSanitizer, privateMessageController.getUserMessages);
router.get('/private', getLatestMessageSanitizer, privateMessageController.getLatestPrivateMessage);

module.exports = router;
