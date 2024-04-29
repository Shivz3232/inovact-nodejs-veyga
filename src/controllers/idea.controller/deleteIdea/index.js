const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea, checkIfCanDelete } = require('./queries/queries');
const insertUserActivity = require('../../../utils/insertUserActivity');

const deleteIdea = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id, cognito_sub } = req.body;

  const variables = {
    id,
  };

  const checkIfCanDeleteResponse = await Hasura(checkIfCanDelete, {
    id,
    cognito_sub,
  });

  if (checkIfCanDeleteResponse.result.data.idea.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You can not delete this idea',
      data: null,
    });
  }

  const response = await Hasura(delete_idea, variables);

  const userId = response.result.data.delete_project_by_pk.user_id;
  const teamId = checkIfCanDeleteResponse.result.data.idea[0].team_id;

  insertUserActivity('uploading-idea', 'negative', response.result.data.delete_idea_by_pk.user_id, [id]);

  if (checkIfCanDeleteResponse.result.data.idea[0].team.looking_for_members) {
    insertUserActivity('looking-for-team-member', 'negative', userId, [teamId]);
  }

  if (checkIfCanDeleteResponse.result.data.idea[0].team.looking_for_mentors) {
    insertUserActivity('looking-for-team-mentor', 'negative', userId, [teamId]);
  }

  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteIdea;
