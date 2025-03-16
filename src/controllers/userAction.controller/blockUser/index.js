const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { blockUserMutation } = require('./queries/mutations');
const { getUserIds, checkBlockExists } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const blockUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, user_id, reason } = req.body;

  // Verify both users exist
  const userCheckResponse = await Hasura(getUserIds, {
    cognito_sub,
    blocked_user_id: user_id,
  });

  if (!userCheckResponse.result.data.blocker.length) {
    return res.status(404).json({
      success: false,
      errorCode: 'BlockerNotFound',
      errorMessage: 'Blocker user not found',
    });
  }

  if (!userCheckResponse.result.data.blocked.length) {
    return res.status(404).json({
      success: false,
      errorCode: 'BlockedUserNotFound',
      errorMessage: 'User to block not found',
    });
  }

  const blockerUserId = userCheckResponse.result.data.blocker[0].id;

  // Prevent self-blocking
  if (blockerUserId === user_id) {
    return res.status(400).json({
      success: false,
      errorCode: 'SelfBlock',
      errorMessage: 'You cannot block yourself',
    });
  }

  // Check if already blocked
  const blockCheckResponse = await Hasura(checkBlockExists, {
    userId: blockerUserId,
    blockedUserId: user_id
  });
  
  if (blockCheckResponse.result.data.user_blocks.length > 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'AlreadyBlocked',
      errorMessage: 'You have already blocked this user',
    });
  }

  // Create the block
  const blockResponse = await Hasura(blockUserMutation, {
    userId: blockerUserId,
    blockedUserId: user_id,
    reason,
  });

  return res.json({
    success: true,
    data: blockResponse.result.data.insert_user_blocks_one,
    message: 'User blocked successfully'
  });
});

module.exports = blockUser;