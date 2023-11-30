const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { addTeamDocumentQuery } = require('./queries/mutations');
const { getUserId } = require('./queries/queries');
const upload = require('../../../utils/uploadDocument');
const notify = require('../../../utils/notify');
const logger = require('../../../config/logger');

const addTeamDocument = catchAsync(async (req, res) => {
  try {
    const sanitizerErrors = validationResult(req);
    if (!sanitizerErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: sanitizerErrors.array(),
      });
    }

    const { cognito_sub, team_id, name } = req.body;

    // Upload the document
    const uploadMiddleware = upload('team-documents', team_id);
    await uploadMiddleware.single('file')(req, res);

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        errorMessage: 'No file uploaded',
      });
    }

    const url = req.file.location;
    const mime_type = req.file.mimetype;

    const response1 = await Hasura(getUserId, {
      cognito_sub,
    });
    const user_id = response1.result.data.user[0].id;

    // Upload the document info to Hasura
    const response2 = await Hasura(addTeamDocumentQuery, {
      team_id,
      name,
      url,
      mime_type,
    });

    // Notify the user
    notify(
      22,
      req.body.team_id,
      user_id,
      response1.result.data.team_members.map((team_member) => team_member.user_id).filter((id) => id !== user_id)
    );

    return res.status(201).json({
      success: true,
      errorCode: null,
      errorMessage: null,
      data: response2.result.data.insert_team_documents.returning[0],
    });
  } catch (error) {
    logger.error('Error:', error);
    return res.status(500).json({
      success: false,
      errorCode: 500,
      errorMessage: 'Internal server error',
      data: null,
    });
  }
});

module.exports = { addTeamDocument };
