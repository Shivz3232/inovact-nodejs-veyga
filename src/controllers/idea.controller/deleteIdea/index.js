const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea, getUserId } = require('./queries/queries');
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

  const getUserIdResponse = await Hasura(getUserId, {
    cognitoSub: cognito_sub,
  });

  const variables = {
    id,
  };
  const response = await Hasura(delete_idea, variables);
 
  console.log(getUserIdResponse.result.data.user[0].id);
  insertUserActivity('uploading-idea', 'negative', getUserIdResponse.result.data.user[0].id, [id]);

  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteIdea;
