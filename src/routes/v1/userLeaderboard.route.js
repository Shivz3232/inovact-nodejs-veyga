const express = require('express');
const userLeaderboardController = require('../../controllers/v1/userLeaderboard.controller');
const {
  getUserLeaderboardSanitizer,
} = require('../../controllers/v1/userLeaderboard.controller/sanitizer');

const router = express.Router();

router.get('/', getUserLeaderboardSanitizer, userLeaderboardController.getUserLeaderboard);

module.exports = router;
