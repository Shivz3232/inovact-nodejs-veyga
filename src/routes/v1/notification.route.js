const router = require('express').Router();

const notificationController = require('../../controllers/notification.controller');
const { getNotificationsSanitizer, markAsReadSanitizer } = require('../../controllers/notification.controller/sanitizer');

router.get('/', getNotificationsSanitizer, notificationController.getUserNotification);
router.post('/markasread', markAsReadSanitizer, notificationController.markAsRead);

module.exports = router;
