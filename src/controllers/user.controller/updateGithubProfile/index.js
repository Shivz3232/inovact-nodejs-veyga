const { validationResult } = require('express-validator');

const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { UpdateGithubProfile } = require('./queries/mutation');

const updateGithubProfile = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const { github_profile } = req.body;

  await Hasura(UpdateGithubProfile, {
    cognito_sub,
    github_profile,
  });

  return res.status(200).json({
    success: true,
  });
});

module.exports = updateGithubProfile;
