const router = require('express').Router()

const commentController = require('../../controllers/comment.controller')

router.post('/' , commentController)

module.exports = router