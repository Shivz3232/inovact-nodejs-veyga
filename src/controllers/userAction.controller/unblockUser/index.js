const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { unblockUserMutation } = require('./queries/mutations');
const { getUserIds, checkBlockExists } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const unblockUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, user_id } = req.body;

  // Verify both users exist
  const userCheckResponse = await Hasura(getUserIds, {
    cognito_sub,
    blocked_user_id: user_id,
  });

  if (!userCheckResponse.result.data.blocker.length) {
    return res.status(404).json({
      success: false,
      errorCode: 'BlockerNotFound',
      errorMessage: 'User not found',
    });
  }

  const blockerUserId = userCheckResponse.result.data.blocker[0].id;

  // Check if block exists
  const blockCheckResponse = await Hasura(checkBlockExists, {
    userId: blockerUserId,
    blockedUserId: user_id
  });
  
  if (blockCheckResponse.result.data.user_blocks.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotBlocked',
      errorMessage: 'This user is not blocked',
    });
  }

  // Remove the block
  const unblockResponse = await Hasura(unblockUserMutation, {
    userId: blockerUserId,
    blockedUserId: user_id,
  });

  return res.json({
    success: true,
    message: 'User unblocked successfully',
    affected_rows: unblockResponse.result.data.delete_user_blocks.affected_rows
  });
});

module.exports = unblockUser;