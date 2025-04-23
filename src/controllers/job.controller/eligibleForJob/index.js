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

  const hasUpdatedPhNo = response.result.data.user_aggregate.aggregate.count === 1;
  const hasEnoughProjects = response.result.data.project_aggregate.aggregate.count === 3;

  return res.json({
    success: true,
    data: {
      summary: hasUpdatedPhNo && hasEnoughProjects,
      hasUpdatedPhNo,
      hasEnoughProjects,
    },
  });
});

module.exports = eligibleForJob;
