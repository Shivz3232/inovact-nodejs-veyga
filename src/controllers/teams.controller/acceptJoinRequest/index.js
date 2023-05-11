const { query: Hasura } = require('../../../utils/hasura');
const { checkIfPossibleToAccept, getRoleRequirement } = require('./queries/queries');
const { acceptJoinRequest1, acceptJoinRequest2 } = require('./queries/mutations');
const notify = require('../../../utils/notify');
const catchAsync = require('../../../utils/catchAsync');

const acceptJoinRequest = catchAsync(async (req, res) => {
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

  let query;
  let variables2 = {
    team_id: response1.result.data.team_requests[0].team_id,
    user_id: response1.result.data.team_requests[0].user_id,
    request_id,
  };

  if (response1.result.data.team_requests[0].role_requirement_id != null) {
    const response2 = await Hasura(getRoleRequirement, {
      roleRequirementId: response1.result.data.team_requests[0].role_requirement_id,
    });

    if (!response2.success)
      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to get role requirement details',
        data: null,
      });

    variables2['role'] = response2.result.data.team_role_requirements[0].role_name;
    variables2['role_requirement_id'] = response1.result.data.team_requests[0].role_requirement_id;

    query = acceptJoinRequest1;
  } else {
    variables2['role'] = 'mentor';

    query = acceptJoinRequest2;
  }

  const response3 = await Hasura(query, variables2);

  if (!response3.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response3.errors),
      data: null,
    });

  // Notify the user
  await notify(21, response1.result.data.team_requests[0].team_id, response1.result.data.team_members[0].user_id, [
    response1.result.data.team_requests[0].user_id,
  ]).catch(console.log);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = acceptJoinRequest;
