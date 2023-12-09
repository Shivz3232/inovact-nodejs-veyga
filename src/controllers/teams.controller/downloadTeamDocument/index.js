const { validationResult } = require('express-validator');

const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { getDocumentKey } = require('./queries/queries');
const generateS3SignedURL = require('../../../utils/generateS3SignedURL');

const downloadTeamDocument = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  const { cognito_sub: cognitoSub, documentId } = req.body;

  // Check if the user is a member of the team
  const response1 = await Hasura(getDocumentKey, {
    cognitoSub,
    documentId,
  });

  if (response1.result.data.team_documents.length === 0) {
    return res.status(404).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Document not found',
    });
  }

  // Get S3 signed URL for document key
  const url = await generateS3SignedURL(response1.result.data.team_documents[0].url);

  return res.status(201).json({
    success: true,
    errorCode: null,
    errorMessage: null,
    data: {
      downloadUrl: url,
    },
  });
});

module.exports = downloadTeamDocument;
