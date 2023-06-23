const { createSchedule, deleteSchedule } = require('../../../utils/scheduler');
const { query: Hasura } = require('../../../utils/hasura');
const { toggleStatus, addUserCause } = require('./queries/mutations');
const { getUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const deactivateUser = catchAsync(async (req, res) => {
  const { cognito_sub, status, cause } = req.body;

  const response1 = await Hasura(toggleStatus, {
    cognito_sub,
    status,
  });

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  const response2 = await Hasura(getUserId, {
    cognito_sub,
  });

  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch User account details',
      data: null,
    });
  }

  const user_id = response2.result.data.user[0].id;

  const variables = {
    user_id,
    cause,
    action: 'deactivate',
  };

  if (!status) {
    const response3 = await Hasura(addUserCause, variables);

    if (!response3.success) {
      logger.error(JSON.stringify(response3.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to deactivate Account',
        data: null,
      });
    }

    const response4 = await createSchedule(cognito_sub);

    if (!response4.success) {
      logger.error(JSON.stringify(response4.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: response4.errors,
        data: null,
      });
    }
  } else {
    const response5 = await deleteSchedule(cognito_sub);

    if (!response5.success) {
      logger.error(JSON.stringify(response5.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: response5.errors,
        data: null,
      });
    }
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deactivateUser;
