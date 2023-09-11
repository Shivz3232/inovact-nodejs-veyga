const { query: Hasura } = require('../../../utils/hasura');
const { checkCanDeleteRequest } = require('./queries/queries');
const { deleteRequest } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const withdrawRequest = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const { user_id } = req.query;

  const variables = {
    user_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkCanDeleteRequest, variables);

  if (response1.result.data.connections_aggregate.aggregate.count == 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });
  }

  const response2 = await Hasura(deleteRequest, variables);

  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = withdrawRequest;
