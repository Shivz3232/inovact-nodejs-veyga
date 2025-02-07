const router = require('express').Router({ mergeParams: true });
const repliesController = require('../../controllers/replies.controller');
const {
  replySanitizer,
  updateReplySanitizer,
  removeReplySanitizer,
} = require('../../controllers/replies.controller/sanitizer');

router.get('/', replySanitizer, repliesController.getReplies);
router.post('/', replySanitizer, repliesController.addReply);
router.put('/:replyId', updateReplySanitizer, repliesController.updateReply);
router.delete('/:replyId', removeReplySanitizer, repliesController.removeReply);

module.exports = router;
