const express = require('express');
const userPointsController = require('../../controllers/userPoints.controller/');
const { getUserPointsSanitizer } = require('../../controllers/userPoints.controller/sanitizer');

const router = express.Router();

router.get('/', getUserPointsSanitizer, userPointsController.getUserPoints);

module.exports = router;
