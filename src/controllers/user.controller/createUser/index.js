const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { createUserQuery, createUserIntrestQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { email_id, user_name, university, degree, graduation_year, cognito_sub, first_name, last_name, bio, avatar } = req.body;

  const userData = {
    email_id,
    university,
    degree,
    graduation_year,
    first_name,
    last_name,
    cognito_sub,
    user_name,
    bio,
    avatar,
  };

  const response = await Hasura(createUserQuery, userData);

  const userId = response.result.data.insert_user_one.id;

  if (req.body.user_interests instanceof Array) {
    const interests = req.body.user_interests.map((ele) => {
      return {
        area_of_interest: {
          data: {
            interest: ele.interest.toLowerCase(),
          },
        },
        user_id: userId,
      };
    });

    const variables = {
      objects: interests,
    };

    await Hasura(createUserIntrestQuery, variables);
  }

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = createUser;
