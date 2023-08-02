const { query, body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const acceptJoinRequestSanitizer = [cognito_sub, body('request_id', 'Invalid Request provided in the body').exists().toInt()];

const addTeamDocSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID provided in the body').exists().toInt(), body('name', 'Invalid Document Name provided in the body').isString().isLength({ min: 1 }), body('url', 'Invalid URL provided in the body').isURL(), body('mime_type', 'Invalid MIME type provided in the body').isMimeType()];

const deleteMemberSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID').exists().toInt(), body('user_id', 'Invalid User ID provided').exists().toInt()];

const joinTeamSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID').exists().toInt(), body('role_requirement_id', 'Invalid Role requirement ID').exists().toInt()];

const rejectJoinRequestSanitizer = [cognito_sub, body('request_id', 'Invalid Request ID').exists().toInt()];

const toggleAdminSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID').exists().toInt(), body('user_id', 'Invalid User ID provided').exists().toInt()];

module.exports = { acceptJoinRequestSanitizer, addTeamDocSanitizer, deleteMemberSanitizer, joinTeamSanitizer, rejectJoinRequestSanitizer, toggleAdminSanitizer };
