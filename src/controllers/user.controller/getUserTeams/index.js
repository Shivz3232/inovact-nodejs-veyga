const { query: Hasura } = require('../../../utils/hasura');
const { getUserTeams: getUserTeamsQuery, getUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const { validationResult } = require('express-validator');

const getUserTeams = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  let { user_id } = req.query;

  if (!user_id) {
    // Find user id
    const { cognito_sub } = req.body;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
  };

  const response2 = await Hasura(getUserTeamsQuery, variables);

  return res.json(response2.result);
});

module.exports = getUserTeams;
