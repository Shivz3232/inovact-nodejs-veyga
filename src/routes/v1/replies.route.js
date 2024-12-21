const router = require('express').Router({ mergeParams: true });
const repliesController = require('../../controllers/replies.controller');
const {
  replySanitizer,
  updateReplySanitizer,
  removeReplySanitizer,
} = require('../../controllers/replies.controller/sanitizer');

router.post('/', replySanitizer, repliesController.addReply);
// router.put('/:commentId', updateReplySanitizer, repliesController.updateComment);
// router.delete('/:commentId', removeReplySanitizer, repliesController.removeComment);

module.exports = router;
