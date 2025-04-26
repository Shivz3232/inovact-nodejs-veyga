const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');
const { getEligibilityData } = require('./queries/queries');

const eligibleForJob = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const response = await Hasura(getEligibilityData, { cognito_sub });

  const user = response.result.data.user[0];
  const hasUpdatedPhNo = user.phone_number != null;
  const hasUpdatePortfolioLink = user.portfolio_link != null;
  const hasEnoughProjects = response.result.data.project_aggregate.aggregate.count === 3;

  return res.json({
    success: true,
    data: {
      summary: hasUpdatedPhNo && hasEnoughProjects && hasUpdatePortfolioLink,
      hasUpdatedPhNo,
      hasEnoughProjects,
      hasUpdatePortfolioLink,
    },
  });
});

module.exports = eligibleForJob;
