const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { deleteAreaOfInterest: deleteAreaOfInterestQuery } = require('./queries/mutations');
const catchAsync = require('../../../../utils/catchAsync');

const deleteAreaOfInterest = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, interest_ids } = req.body;

  const variables = {
    cognito_sub,
    interest_ids,
  };

  const response = await Hasura(deleteAreaOfInterestQuery, variables);

  return res.status(204).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteAreaOfInterest;
