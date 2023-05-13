const router = require('express').Router()
const privateMessageController = require('../../controllers/privateMessage.controller')


router.post('/private' , privateMessageController.sendPrivateMessage)
router.get('/private' , privateMessageController.getLatestPrivateMessage)

module.exports = router