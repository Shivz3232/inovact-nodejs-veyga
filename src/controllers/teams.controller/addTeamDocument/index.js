const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { add_TeamDocument } = require('./queries/mutations');
const { checkIfAdmin } = require('./queries/queries');
const notify = require('../../../utils/notify');
const logger = require('../../../config/logger');

const addTeamDocument = catchAsync(async (req, res) => {
  // Check if current user is team admin
  const response1 = await Hasura(checkIfAdmin, {
    cognito_sub: req.body.cognito_sub,
    team_id: req.body.team_id,
  });

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
    });
  }

  if (response1.result.data.current_user.length == 0 || !response1.result.data.current_user[0].admin)
    return res.json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team',
      data: null,
    });

  // Upload the document info to Hasura
  const response2 = await Hasura(add_TeamDocument, {
    team_id: req.body.team_id,
    name: req.body.name,
    url: req.body.url,
    mime_type: req.body.mime_type,
  });

  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }

  const user_id = response1.result.data.current_user[0].user_id;

  // Notify the user
  await notify(
    22,
    req.body.team_id,
    user_id,
    response1.result.data.team_members.map((team_member) => team_member.user_id).filter((id) => id != user_id)
  ).catch(console.log);

  return res.json({
    success: true,
    errorCode: null,
    errorMessage: null,
  });
});

module.exports = addTeamDocument;
