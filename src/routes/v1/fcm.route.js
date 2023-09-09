const express = require('express');
const router = express.Router();
const fcmController = require('../../controllers/fcm.controller/fcmController');

router.post('/send-notification', fcmController.sendNotification);

module.exports = router;
