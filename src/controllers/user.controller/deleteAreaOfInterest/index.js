const { query: Hasura } = require('../../../utils/hasura');
const { deleteAreaOfInterest  : deleteAreaOfInterestQuery} = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const deleteAreaOfInterest = catchAsync(async (req,res)=>{
  const { cognito_sub, interest_ids } = req.body;

  const variables = {
    cognito_sub,
    interest_ids,
  };

  const response = await Hasura(deleteAreaOfInterestQuery, variables);
  console.log(response)

  if (!response.success) {
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
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

module.exports = deleteAreaOfInterest
