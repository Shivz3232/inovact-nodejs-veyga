const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { updateUserActions } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const getUserActionValues = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }
  const { cognito_sub } = req.body;
  const { body } = req;

  const allowedFields = ['team_tutorial_complete', 'feed_tutorial_complete', 'profile_tutorial_complete', 'has_uploaded_project', 'has_uploaded_idea', 'has_uploaded_thought', 'has_sought_team', 'has_sought_mentor', 'has_sought_team_and_mentor', 'last_app_opened_timestamp'];

  const data = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  const updateUserActionsResponse = await Hasura(updateUserActions, {
    cognitoSub: cognito_sub,
    data,
  });
  
  return res.status(200).json({
    success: true,
    data: updateUserActionsResponse.result.data.update_user_actions.returning[0],
  });
});

module.exports = getUserActionValues;
