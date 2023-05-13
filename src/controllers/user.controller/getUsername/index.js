const { query: Hasura } = require('../../../utils/hasura');
const { getUsernameFromEmail } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUsername = catchAsync(async (req,res)=>{
  const email = req.body.email;

  const response = await Hasura(getUsernameFromEmail, { email });

  if (!response.success) {
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  if (response.result.data.user.length == 0) {
    return res.json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'User not found',
      data: null,
    });
  }

  res.json({
    success: true,
    errorCode: null,
    errorMessage: null,
    data: response.result.data.user[0].user_name,
  });
});


module.exports = getUsername
