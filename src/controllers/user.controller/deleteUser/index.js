const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { deleteUser: deleteUserQuery, addUserCause } = require('./queries/mutations');
const { getUserId } = require('./queries/queries');
const { deleteUserFunc } = require('../../../utils/deleteFirebaseUser');
const catchAsync = require('../../../utils/catchAsync');
const { getRecruitmentServerInstance } = require('../../../utils/axios');
const logger = require('../../../config/logger');

const deleteUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, cause } = req.body;

  const response1 = await Hasura(getUserId, {
    cognito_sub,
  });

  const user_id = response1.result.data.user[0].id;

  const response2 = await deleteUserFunc(cognito_sub);

  const variables = {
    user_id,
    cause,
    action: 'delete',
  };

  const response3 = await Hasura(addUserCause, variables);

  const response4 = await Hasura(deleteUserQuery, { user_id });

  // Notify recruitment server of the user deletion.
  const recruitmentServerInstance = await getRecruitmentServerInstance('/private/user/delete');
  recruitmentServerInstance.post(null, { cognito_sub }).catch((err) => {
    logger.error(err.code, err.name, err.message);
  });

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteUser;
