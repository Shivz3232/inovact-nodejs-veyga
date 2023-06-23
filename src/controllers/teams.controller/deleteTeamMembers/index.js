const { query: Hasura } = require('../../../utils/hasura');
const { checkIfCanDelete } = require('./queries/queries.js');
const { deleteTeamMember } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const deleteTeamMembers = catchAsync(async (req, res) => {
  const { user_id, cognito_sub, team_id } = req.body;

  const variables = {
    team_id,
    user_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfCanDelete, variables);

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  if (response1.result.data.admins.length == 0) {
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team.',
      data: null,
    });
  }

  if (response1.result.data.members.length == 0) {
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'Given user is not a member of this team.',
      data: null,
    });
  }

  if (response1.result.data.members[0].admin) {
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You cannot remove an admin of this team.',
      data: null,
    });
  }

  const variables2 = {
    user_id,
    team_id,
  };

  const response2 = await Hasura(deleteTeamMember, variables2);

  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteTeamMembers;
