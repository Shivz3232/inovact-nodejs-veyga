const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { add_TeamDocument } = require('./queries/mutations');
const { checkIfAdmin } = require('./queries/queries');
const notify = require('../../../utils/notify');

const addTeamDocument = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, team_id, name, url, mime_type } = req.body;

  // Check if current user is team admin
  const response1 = await Hasura(checkIfAdmin, {
    cognito_sub,
    team_id,
  });

  if (response1.result.data.current_user.length == 0 || !response1.result.data.current_user[0].admin)
    return res.status(401).json({
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team',
      data: null,
    });

  // Upload the document info to Hasura
  const response2 = await Hasura(add_TeamDocument, {
    team_id,
    name,
    url,
    mime_type,
  });

  const { user_id } = response1.result.data.current_user[0];

  // Notify the user
  await notify(
    22,
    req.body.team_id,
    user_id,
    response1.result.data.team_members.map((team_member) => team_member.user_id).filter((id) => id != user_id)
  ).catch(console.log);

  return res.status(201).json({
    success: true,
    errorCode: null,
    errorMessage: null,
  });
});

module.exports = addTeamDocument;
