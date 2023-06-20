const { query: Hasura } = require('../../../utils/hasura');
const { checkCanDeleteRequest } = require('./queries/queries');
const { deleteRequest } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const withdrawRequest = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const user_id = req.query.user_id;

  const variables = {
    user_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkCanDeleteRequest, variables);

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  if (response1.result.data.connections_aggregate.aggregate.count == 0) {
    return res.json({
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });
  }

  const response2 = await Hasura(deleteRequest, variables);

  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
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

module.exports = withdrawRequest;
