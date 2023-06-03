const router = require('express').Router();

const notificationController = require('../../controllers/notification.controller');

router.get('/', notificationController.getUserNotification);
router.post('/markasRead', notificationController.markAsRead);

module.exports = router;
