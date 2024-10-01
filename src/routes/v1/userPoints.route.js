const express = require('express');
const userPointsController = require('../../controllers/v1/userPoints.controller/');
const { getUserPointsSanitizer } = require('../../controllers/v1/userPoints.controller/sanitizer');

const router = express.Router();

router.get('/', getUserPointsSanitizer, userPointsController.getUserPoints);

module.exports = router;
