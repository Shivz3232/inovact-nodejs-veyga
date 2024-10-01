const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { getUserContributions } = require('./queries/queries');
const catchAsync = require('../../../../utils/catchAsync');

const getStats = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const getUserContributionsResponse = await Hasura(getUserContributions, {
    cognitoSub: cognito_sub,
  });

  if (!getUserContributionsResponse) {
    return res.status(500).json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'An internal server error occurred',
    });
  }

  const { projectsCount, ideasCount, thoughtsCount } = getUserContributionsResponse.result.data;

  const data = {
    projectsCount: projectsCount.aggregate.count,
    ideasCount: ideasCount.aggregate.count,
    thoughtsCount: thoughtsCount.aggregate.count,
  };

  return res.json({
    success: true,
    data,
  });
});

module.exports = getStats;
