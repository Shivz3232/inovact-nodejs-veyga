const { validationResult } = require('express-validator');
const catchAsync = require('../../../../utils/catchAsync');
const { query: Hasura } = require('../../../../utils/hasura');
const { getTeamDocumentQuery, checkIfMemberQuery, deleteTeamDocumentQuery } = require('./queries/queries');
const deleteDocument = require('../../../../utils/deleteDocument');

const deleteTeamDocument = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  const { cognito_sub: cognitoSub, teamId, documentId } = req.body;

  // Check if the user is a member of the team
  const memberCheckResult = await Hasura(checkIfMemberQuery, {
    cognitoSub,
    teamId,
  });

  if (memberCheckResult.result.data.team_members.length === 0) {
    return res.status(403).json({
      success: false,
      errorCode: 'FORBIDDEN',
      errorMessage: 'You are not authorized to perform this action',
    });
  }

  const getTeamDocumentResult = await Hasura(getTeamDocumentQuery, {
    id: documentId,
  });

  if (getTeamDocumentResult.result.data.team_documents_by_pk === null) {
    return res.status(404).json({
      success: false,
      errorCode: 'NOT_FOUND',
      errorMessage: 'Document not found',
    });
  }

  const { url: documentUrl } = getTeamDocumentResult.result.data.team_documents_by_pk;

  await deleteDocument(documentUrl);

  await Hasura(deleteTeamDocumentQuery, {
    id: documentId,
  });

  return res.status(200).json({
    success: true,
    errorCode: null,
    errorMessage: null,
  });
});

module.exports = deleteTeamDocument;
