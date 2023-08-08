const router = require('express').Router();
const privateMessageController = require('../../controllers/privateMessage.controller');
const { getLatestMessageSanitizer, getUserMessagesSanitizer, sendMessageSanitizer } = require('../../controllers/privateMessage.controller/sanitizer');

router.post('/private', getLatestMessageSanitizer, privateMessageController.sendPrivateMessage);
router.get('/users', getUserMessagesSanitizer, privateMessageController.getUserMessages);
router.get('/private', sendMessageSanitizer, privateMessageController.getLatestPrivateMessage);

module.exports = router;
