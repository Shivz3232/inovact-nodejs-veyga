const { createSchedule, deleteSchedule } = require('../../../utils/scheduler');
const { query: Hasura } = require('../../../utils/hasura');
const { toggleStatus, addUserCause } = require('./queries/mutations');
const { getUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const deactivateUser = catchAsync(async (req, res) => {
  const { cognito_sub, status, cause } = req.body;

  const response1 = await Hasura(toggleStatus, {
    cognito_sub,
    status,
  });

  const response2 = await Hasura(getUserId, {
    cognito_sub,
  });

  const user_id = response2.result.data.user[0].id;

  const variables = {
    user_id,
    cause,
    action: 'deactivate',
  };

  if (!status) {
    const response3 = await Hasura(addUserCause, variables);

    const response4 = await createSchedule(cognito_sub);
  } else {
    const response5 = await deleteSchedule(cognito_sub);
  }

  return res.status(202).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deactivateUser;
