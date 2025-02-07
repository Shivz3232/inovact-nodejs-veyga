const router = require('express').Router();

const commentController = require('../../controllers/comment.controller');
const {
  commentSanitizer,
  updateCommentSanitizer,
  removeCommentSanitizer,
} = require('../../controllers/comment.controller/sanitizer');
const replyRoute = require('./replies.route.js');

router.post('/', commentSanitizer, commentController.addComment);
router.put('/:commentId', updateCommentSanitizer, commentController.updateComment);
router.delete('/:commentId', removeCommentSanitizer, commentController.removeComment);
router.use('/:commentId/replies', replyRoute);

module.exports = router;
