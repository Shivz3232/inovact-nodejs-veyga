const { query: Hasura } = require('../../../utils/hasura');
const {
  updateThought_query,
  getUserId,
  getThoughtUserId,
} = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const updateThought = catchAsync(async(req,res)=>{
  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
      data: null,
    });

  const id = await req.body.id;
  const variable = {
    id,
  };

  const response2 = await Hasura(getThoughtUserId, variable);

  if (!response2.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find thought',
      data: null,
    });

  //check current user
  if (
    response2.result.data.thoughts[0].user_id ==
    response1.result.data.user[0].id
  ) {
    let variables = await {
      id: {
        _eq: req.body.id,
      },
      changes: {},
    };

    if (req.body.thought) variables['changes']['thought'] = req.body.thought;

    const response = await Hasura(updateThought_query, variables);

    if (response.success) {
      res.json({
        success: true,
        errorCode: '',
        errorMessage: '',
        data: null,
      });
    } else {
      res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to update thought',
        data: null,
      });
    }
  } else {
    res.json({
      success: false,
      errorCode: 'UnauthorizedUserException',
      errorMessage: 'Only the owner the thought can update it.',
      data: null,
    });
  }
});

module.exports = updateThought