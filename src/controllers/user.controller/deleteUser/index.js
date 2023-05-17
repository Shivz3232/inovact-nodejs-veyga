const { query: Hasura } = require('../../../utils/hasura');
const { deleteUser: deleteUserQuery, addUserCause } = require('./queries/mutations');
const { getUserId } = require('./queries/queries');
const { deleteUserFunc } = require('../../../utils/deleteFirebaseUser');
const catchAsync = require('../../../utils/catchAsync');

const deleteUser = catchAsync(async (req, res) => {
  const { cognito_sub, cause } = req.body;

  const response1 = await Hasura(getUserId, {
    cognito_sub,
  });

  if (!response1.success) {
    console.log(response1.errors);

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch User account details',
      data: null,
    });
  }

  const user_id = response1.result.data.user[0].id;

  const response2 = await deleteUserFunc(cognito_sub);

  if (!response2.success) {
    console.log(response2.errors);

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: response2.errors,
      data: null,
    });
  }

  const variables = {
    user_id,
    cause,
    action: 'delete',
  };

  const response3 = await Hasura(addUserCause, variables);

  if (!response3.success) {
    console.log(response3.errors);

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete Account',
      data: null,
    });
  }

  const response4 = await Hasura(deleteUserQuery, { user_id });

  if (!response4.success) {
    console.log(response4.errors);

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete Account',
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

module.exports = deleteUser;
