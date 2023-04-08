const router = require('express').Router()

const notificationController = require('../../controllers/notification.controller')

router.get('/' , notificationController.getUserNotification)
router.post('/markAsRead' , notificationController.markAsRead)

module.exports = router