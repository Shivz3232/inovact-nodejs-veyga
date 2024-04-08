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

  insertUserActivity('uploading-project', 'negative', response.result.data.delete_project_by_pk.user_id, [id]);

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteProject;
