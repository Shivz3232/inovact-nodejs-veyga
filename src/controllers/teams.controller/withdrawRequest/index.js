const { query: Hasura } = require('../../../utils/hasura');
const { checkCanDeleteRequest } = require('./queries/queries');
const { deleteRequest } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const withdrawRequest = catchAsync(async (req, res) => {
  const { cognito_sub, request_id } = req.bod;

  const variables = {
    request_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkCanDeleteRequest, variables);

  if (response1.result.data.team_requests.length == 0) {
    return res.json({
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });
  }

  const response2 = await Hasura(deleteRequest, { request_id });

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = withdrawRequest;
