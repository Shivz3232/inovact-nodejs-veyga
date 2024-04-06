const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { deletequery } = require('./queries/queries');
const insertUserActivity = require('../../../utils/insertUserActivity');

const deleteProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id } = req.body;

  const variables = {
    id,
  };

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
