const router = require('express').Router();

const commentController = require('../../controllers/comment.controller');
const { commentSanitizer } = require('../../controllers/comment.controller/sanitizer');

router.post('/', commentSanitizer, commentController.addComment);
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.removeComment);

module.exports = router;
