const catchAsync = require('../../../utils/catchAsync');
const { makeAdmin } = require('./queries/mutations');
const { checkIfCanMakeAdmin } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');
const { validationResult } = require('express-validator');

const toggleAdmin = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { user_id, team_id, cognito_sub } = req.body;

  const variables = {
    user_id,
    team_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfCanMakeAdmin, variables);

  if (response1.result.data.members.length == 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'Given user is not a member of this team.',
      data: null,
    });
  }

  if (response1.result.data.members[0].admin) {
    return res.status(400).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'Given user is already an admin of this team.',
      data: null,
    });
  }

  if (response1.result.data.admins.length == 0) {
    return res.status(401).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team.',
      data: null,
    });
  }

  const response2 = await Hasura(makeAdmin, { team_id, user_id });

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = toggleAdmin;
