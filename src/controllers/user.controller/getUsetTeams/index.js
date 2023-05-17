const { query: Hasura } = require('../../../utils/hasura');
const { getUserTeams : getUserTeamsQuery, getUserId } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const getUserTeams =  catchAsync(async (req,res)=>{
  let user_id = req.body.user_id;

  if (!user_id) {
    // Find user id
    const cognito_sub = req.body.cognito_sub;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    if (!response1.success) return res.json( response1.errors);

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
  };

  const response2 = await Hasura(getUserTeamsQuery, variables);

  if (!response2.success) return res.json( response2.errors);

  res.json( response2.result);
});

module.exports = getUserTeams
