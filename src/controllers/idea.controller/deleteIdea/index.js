const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea } = require('./queries/queries');
const insertUserActivity = require('../../../utils/insertUserActivity');

const deleteIdea = catchAsync(async (req, res) => {
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

  const response = await Hasura(delete_idea, variables);

  insertUserActivity('uploading-idea', 'negative', response.result.data.delete_idea_by_pk.user_id, [id]);

  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteIdea;
