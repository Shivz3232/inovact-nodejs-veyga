const express = require('express');
const userLeaderboardController = require('../../controllers/userLeaderboard.controller/');
const {
  getUserLeaderboardSanitizer,
} = require('../../controllers/userLeaderboard.controller/sanitizer');

const router = express.Router();

router.get('/', getUserLeaderboardSanitizer, userLeaderboardController.getUserLeaderboard);

module.exports = router;
