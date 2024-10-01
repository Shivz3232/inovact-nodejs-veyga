const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { checkIfCanDelete } = require('./queries/queries.js');
const { deleteTeamMember } = require('./queries/mutations');
const catchAsync = require('../../../../utils/catchAsync');

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
  const isAdmin = response1.result.data.admins.length > 0;
  const isMember = response1.result.data.members.length > 0;
  const isCreator = response1.result.data.members[0] && response1.result.data.members[0].team.user.cognito_sub === cognito_sub;

  const isRemovingAdmin = isCreator || (response1.result.data.members[0] && response1.result.data.members[0].admin && response1.result.data.members[0].team.creator_id !== response1.result.data.members[0].team.user.id);

  if (!isAdmin) {
    return res.status(401).json(errorResponse('Forbidden', 'You are not an admin of this team.'));
  }

  if (!isMember) {
    return res.status(400).json(errorResponse('Forbidden', 'Given user is not a member of this team.'));
  }

  if (isRemovingAdmin) {
    await Hasura(deleteTeamMember, { user_id, team_id });
    return res.status(200).json(successResponse);
  }

  return res.status(400).json(errorResponse('Forbidden', 'You cannot remove an admin of this team.'));
});

module.exports = deleteTeamMembers;
