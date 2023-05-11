const { query: Hasura } = require('../../../utils/hasura');
const { checkIfPossibleToAccept } = require('./queries/queries');
const { rejectJoinRequest: rejectJoinRequestQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const rejectJoinRequest = catchAsync(async (req, res) => {
  const request_id = req.body.request_id;
  const cognito_sub = req.body.cognito_sub;

  const variables = {
    request_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfPossibleToAccept, variables);

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  if (response1.result.data.team_requests.length == 0)
    return res.json({
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });

  if (response1.result.data.team_members.length == 0 || !response1.result.data.team_members[0].admin)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team',
      data: null,
    });

  const variables2 = {
    request_id,
  };

  const response2 = await Hasura(rejectJoinRequestQuery, variables2);

  if (!response2.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = rejectJoinRequest;
