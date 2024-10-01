const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { getUserId } = require('./queries/queries');
const { addUserInterests } = require('./queries/mutations');
const catchAsync = require('../../../../utils/catchAsync');

const addAreaOfInterest = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUserId, { cognito_sub });

  const interests = req.body.interests.map((interest) => {
    return {
      area_of_interest: {
        data: {
          interest: interest.toLowerCase(),
        },
        on_conflict: {
          constraint: 'area_of_interests_interest_key',
          update_columns: 'interest',
        },
      },
      user_id: response1.result.data.user[0].id,
    };
  });

  const variables = {
    objects: interests,
  };

  const response = await Hasura(addUserInterests, variables);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addAreaOfInterest;
