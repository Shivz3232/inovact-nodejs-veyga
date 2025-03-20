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

  const { cognito_sub } = req.body;
  const { userId } = req.params;

  const userCheckResponse = await Hasura(getUserIds, {
    cognito_sub,
    blocked_user_id: userId,
  });

  if (!userCheckResponse.result.data.blocker.length) {
    return res.status(404).json({
      success: false,
      errorCode: 'BlockerNotFound',
      errorMessage: 'User not found',
    });
  }

  const blockerUserId = userCheckResponse.result.data.blocker[0].id;

  const blockCheckResponse = await Hasura(checkBlockExists, {
    userId: blockerUserId,
    blockedUserId: userId,
  });

  if (blockCheckResponse.result.data.user_blocked_users.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotBlocked',
      errorMessage: 'This user is not blocked',
    });
  }

  const unblockResponse = await Hasura(unblockUserMutation, {
    userId: blockerUserId,
    blockedUserId: userId,
  });

  return res.json({
    success: true,
    message: 'User unblocked successfully',
    affected_rows: unblockResponse.result.data.delete_user_blocked_users.affected_rows,
  });
});

module.exports = unblockUser;
