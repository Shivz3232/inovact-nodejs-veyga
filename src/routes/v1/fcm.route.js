const express = require('express');

const router = express.Router();
const fcmController = require('../../controllers/v1/fcm.controller/fcmController');

router.post('/token', fcmController.saveToken);

module.exports = router;
