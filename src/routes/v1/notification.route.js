const router = require('express').Router();

const notificationController = require('../../controllers/v1/notification.controller');
const { getNotificationsSanitizer, markAsReadSanitizer } = require('../../controllers/v1/notification.controller/sanitizer');

router.get('/', getNotificationsSanitizer, notificationController.getUserNotification);
router.post('/markasread', markAsReadSanitizer, notificationController.markAsRead);

module.exports = router;
