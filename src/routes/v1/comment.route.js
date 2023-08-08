const router = require('express').Router();

const commentController = require('../../controllers/comment.controller');
const { commentSanitizer } = require('../../controllers/comment.controller/sanitizer');

router.post('/', commentSanitizer, commentController);

module.exports = router;
