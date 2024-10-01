const { validationResult } = require('express-validator');
const config = require('../../../../config/config');
const catchAsync = require('../../../../utils/catchAsync');
const { query: Hasura } = require('../../../../utils/hasura');
const { addTeamDocument: addTeamDocumentQuery } = require('./queries/mutations');
const { checkIfMember, getTeamMembers } = require('./queries/queries');
const uploadToS3 = require('../../../../utils/uploadToS3');
const notify = require('../../../../utils/notify');

const addTeamDocument = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  const { cognito_sub: cognitoSub, team_id: teamId } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      errorCode: 'BAD_REQUEST',
      errorMessage: 'No file was uploaded',
    });
  }

  // Check if the user is a member of the team
  const response1 = await Hasura(checkIfMember, {
    cognitoSub,
    teamId,
  });

  if (response1.result.data.team_members.length === 0) {
    return res.status(403).json({
      success: false,
      errorCode: 'FORBIDDEN',
      errorMessage: 'You are not authorized to perform this action',
    });
  }

  // Upload file to S3
  const key = `${config.env}/team-documents/${teamId}/${req.file.originalname}`;
  const data = req.file.buffer;

  await uploadToS3(key, data);

  // Upload the document info to Hasura
  await Hasura(addTeamDocumentQuery, {
    teamId,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    url: key,
  });

  const { user_id: userId } = response1.result.data.team_members[0];

  const response3 = await Hasura(getTeamMembers, {
    teamId,
    userId,
  });

  // Notify the team members
  notify(
    22,
    req.body.team_id,
    userId,
    response3.result.data.team_members.map((team_member) => team_member.user_id)
  );

  return res.status(201).json({
    success: true,
    errorCode: null,
    errorMessage: null,
  });
});

module.exports = addTeamDocument;
