const router = require('express').Router();

const commentController = require('../../controllers/comment.controller');
const { commentSanitizer, updateCommentSanitizer, removeCommentSanitizer } = require('../../controllers/comment.controller/sanitizer');

router.post('/', commentSanitizer, commentController.addComment);
router.put('/:commentId', updateCommentSanitizer, commentController.updateComment);
router.delete('/:commentId', removeCommentSanitizer, commentController.removeComment);

module.exports = router;
