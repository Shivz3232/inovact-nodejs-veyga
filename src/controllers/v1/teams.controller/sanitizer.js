const { body } = require('express-validator');

const cognito_sub = body('cognito_sub', 'User Not Authorized').exists().isString();

const acceptJoinRequestSanitizer = [cognito_sub, body('request_id', 'Invalid Request provided in the body').exists().toInt()];

const addTeamDocSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID provided in the body').exists().toInt()];

const deleteTeamDocSanitizer = [cognito_sub, body('teamId', 'Invalid Team ID provided in the body').exists().toInt(), body('documentId', 'Invalid Document ID provided in the body').exists().toInt()];

const downloadTeamDocSanitizer = [cognito_sub, body('documentId', 'Invalid Document ID provided in the body').exists().toInt()];

const deleteMemberSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID').exists().toInt(), body('user_id', 'Invalid User ID provided').exists().toInt()];

const joinTeamSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID').exists().toInt(), body('role_requirement_id', 'Invalid Role requirement ID').optional().toInt()];

const rejectJoinRequestSanitizer = [cognito_sub, body('request_id', 'Invalid Request ID').exists().toInt()];

const toggleAdminSanitizer = [cognito_sub, body('team_id', 'Invalid Team ID').exists().toInt(), body('user_id', 'Invalid User ID provided').exists().toInt()];

module.exports = { acceptJoinRequestSanitizer, addTeamDocSanitizer, deleteMemberSanitizer, joinTeamSanitizer, rejectJoinRequestSanitizer, toggleAdminSanitizer, downloadTeamDocSanitizer, deleteTeamDocSanitizer };
