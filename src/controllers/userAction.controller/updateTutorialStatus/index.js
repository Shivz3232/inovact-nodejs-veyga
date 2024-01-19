const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { updateTutorialStatusQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const getTutorialStatus = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, feed_tutorial, profile_tutorial, team_tutorial } = req.body;

  let _set = {};
  if (feed_tutorial !== undefined) _set.feed_tutorial = feed_tutorial;
  if (profile_tutorial !== undefined) _set.profile_tutorial = profile_tutorial;
  if (team_tutorial !== undefined) _set.team_tutorial = team_tutorial;

  if (Object.keys(_set).length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NoUpdateFields',
      errorMessage: 'No fields provided for update',
    });
  }

  const response = await Hasura(updateTutorialStatusQuery, { cognito_sub, _set });

  const responseData = response.result.data.update_user_actions.returning;

  if (!responseData || responseData.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'UserNotFound',
      errorMessage: 'No user found with this cognito sub',
    });
  }

  return res.json(responseData[0]);
});

module.exports = getTutorialStatus;
