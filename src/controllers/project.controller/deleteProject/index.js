const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { deletequery, checkIfCanDelete } = require('./queries/queries');
const insertUserActivity = require('../../../utils/insertUserActivity');

const deleteProject = catchAsync(async (req, res) => {
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

  const checkIfCanDeleteResult = await Hasura(checkIfCanDelete, {
    id,
    cognito_sub,
  });

  if (checkIfCanDeleteResult.result.data.project.length == 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You can not delete this project',
      data: null,
    });
  }

  const response = await Hasura(deletequery, variables);

  const userId = response.result.data.delete_project_by_pk.user_id;
  const teamId = checkIfCanDeleteResult.result.data.project[0].team_id;

  insertUserActivity('uploading-project', 'negative', userId, [id]);

  if (checkIfCanDeleteResult.result.data.project[0].team.looking_for_members) {
    insertUserActivity('looking-for-team-member', 'negative', userId, [teamId]);
  }

  if (checkIfCanDeleteResult.result.data.project[0].team.looking_for_mentors) {
    insertUserActivity('looking-for-team-mentor', 'negative', userId, [teamId]);
  }

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteProject;
