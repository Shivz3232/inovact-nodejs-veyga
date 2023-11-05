const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { checkIfCanDelete, getUserIdFromCognitoSub } = require('./queries/queries.js');
const { deleteTeamMember } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const successResponse = {
  success: true,
  errorCode: '',
  errorMessage: '',
  data: null,
};

const errorResponse = (status, errorCode, errorMessage) => ({
  success: false,
  errorCode,
  errorMessage,
  data: null,
});

const deleteTeamMembers = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { user_id, cognito_sub, team_id } = req.body;

  const variables = { team_id, user_id, cognito_sub };

  const response1 = await Hasura(checkIfCanDelete, variables);
  const createrId = response1.result.data.members[0].team.creator_id;

  const response2 = await Hasura(getUserIdFromCognitoSub, { cognito_sub });
  const currentUserId = response2.result.data.user[0].id;

  const variables2 = { user_id, team_id };

  if (response1.result.data.admins.length === 0) {
    return res.status(401).json(errorResponse('Forbidden', 'You are not an admin of this team.'));
  }

  if (response1.result.data.members.length === 0) {
    return res.status(400).json(errorResponse('Forbidden', 'Given user is not a member of this team.'));
  }

  if (response1.result.data.members[0].admin) {
    if (currentUserId === createrId) {
      await Hasura(deleteTeamMember, variables2);
      return res.status(200).json(successResponse);
    } else {
      return res.status(400).json(errorResponse('Forbidden', 'You cannot remove an admin of this team.'));
    }
  }

  await Hasura(deleteTeamMember, variables2);
  return res.status(200).json(successResponse);
});

module.exports = deleteTeamMembers;
