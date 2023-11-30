const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { add_TeamDocument } = require('./queries/mutations');
const { checkIfAdmin } = require('./queries/queries');
const upload = require('../../../utils/uploadDocument');
const notify = require('../../../utils/notify');

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

    // Check if current user is team admin
    const response1 = await Hasura(checkIfAdmin, {
      cognito_sub,
      team_id,
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
      response1.result.data.team_members.map((team_member) => team_member.user_id).filter((id) => id !== user_id)
    );

    return res.status(201).json({
      success: true,
      errorCode: null,
      errorMessage: null,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Internal server error',
    });
  }
});

module.exports = { addTeamDocument };
