const { validationResult } = require('express-validator');
const { updateUser, addUserSkills, updateUserInterests } = require('./queries/mutations');
const { getUser, getUserIdFromCognito, getUserActivityDetails } = require('./queries/queries');
const cleanUserdoc = require('../../../utils/cleanUserDoc');
const { query: Hasura, checkUniquenessOfPhoneNumber } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');
const insertUserActivity = require('../../../utils/insertUserActivity');

const updateanUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;

  const getUserActivityDetailsQuery = await Hasura(getUserActivityDetails, {
    cognitoSub: cognito_sub,
  });
  const userActivities = getUserActivityDetailsQuery.result.data.user_activities;

  const response = await Hasura(getUserIdFromCognito, {
    cognito_sub,
  });

  const { id: userId } = response.result.data.user[0];

  const variables = {
    cognito_sub: {
      _eq: cognito_sub,
    },
    changes: {},
  };

  if (req.body.first_name) variables.changes.first_name = req.body.first_name;
  if (req.body.last_name) variables.changes.last_name = req.body.last_name;
  if (req.body.bio) {
    variables.changes.bio = req.body.bio;
    const activityIdentifier = 'filing-user-bio';
    const arePointsOfferable = userActivities.filter((ele) => ele.activity.identifier === activityIdentifier).length === 0;
    if ((!response.result.data.user[0].bio || response.result.data.user[0].bio === '' || response.result.data.user[0].bio === null) && arePointsOfferable) {
      await insertUserActivity(activityIdentifier, 'positive', userId, []);
    }
  }

  if (req.body.avatar) variables.changes.avatar = req.body.avatar;
  if (req.body.phone_number) {
    const unique = await checkUniquenessOfPhoneNumber(req.body.phone_number);

    if (!unique) {
      return res.json({
        success: false,
        errorCode: 'PhoneNumberUniquenessException',
        errorMessage: 'This phone number is already in use',
      });
    }

    variables.changes.phone_number = req.body.phone_number;
  }
  if (req.body.role) variables.changes.role = req.body.role;
  if (req.body.designation) variables.changes.designation = req.body.designation;
  if (req.body.organization) variables.changes.organization = req.body.organization;
  if (req.body.organizational_role) variables.changes.organizational_role = req.body.organizational_role;
  if (req.body.university) variables.changes.university = req.body.university;
  if (req.body.graduation_year) variables.changes.graduation_year = req.body.graduation_year;
  if (req.body.journey_start_date) variables.changes.journey_start_date = req.body.journey_start_date;
  if (req.body.years_of_professional_experience) variables.changes.years_of_professional_experience = req.body.years_of_professional_experience;
  if (req.body.degree) variables.changes.degree = req.body.degree;
  if (req.body.github_profile) {
    variables.changes.github_profile = req.body.github_profile;
    const activityIdentifier = 'filing-github';
    const arePointsOfferable = userActivities.filter((ele) => ele.activity.identifier === activityIdentifier).length === 0;
    if ((!response.result.data.user[0].github_profile || response.result.data.user[0].github_profile === '' || response.result.data.user[0].github_profile === null) && arePointsOfferable) {
      await insertUserActivity(activityIdentifier, 'positive', userId, []);
    }
  }
  if (req.body.cover_photo) variables.changes.cover_photo = req.body.cover_photo;
  if (req.body.profile_complete) variables.changes.profile_complete = req.body.profile_complete;

  if (req.body.website) {
    variables.changes.website = req.body.website;
    const activityIdentifier = 'filing-website';
    const arePointsOfferable = userActivities.filter((ele) => ele.activity.identifier === activityIdentifier).length === 0;
    if ((!response.result.data.user[0].website || response.result.data.user[0].website === '' || response.result.data.user[0].website === null) && arePointsOfferable) {
      insertUserActivity(activityIdentifier, 'positive', userId, []);
    }
  } else variables.changes.website = '';

  const response1 = await Hasura(updateUser, variables);

  // Insert skills
  //
  if (req.body.user_skills instanceof Array) {
    const user_skills_with_user_id = req.body.user_skills.map((ele) => {
      return {
        ...ele,
        user_id: response1.result.data.update_user.returning[0].id,
      };
    });

    const variables = {
      objects: user_skills_with_user_id,
      user_id: response1.result.data.update_user.returning[0].id,
    };

    await Hasura(addUserSkills, variables);

    const activityIdentifier = 'filing-user-skills';
    const arePointsOfferable = userActivities.filter((ele) => ele.activity.identifier === activityIdentifier).length === 0;

    if (arePointsOfferable) {
      await insertUserActivity(activityIdentifier, 'positive', userId, []);
    }
  }

  // Insert interests
  if (req.body.user_interests instanceof Array) {
    const interests = req.body.user_interests.map((ele) => {
      return {
        area_of_interest: {
          data: {
            interest: ele.interest.toLowerCase(),
          },
          on_conflict: {
            constraint: 'area_of_interests_interest_key',
            update_columns: 'interest',
          },
        },
        user_id: response1.result.data.update_user.returning[0].id,
      };
    });

    const variables = {
      objects: interests,
      cognito_sub,
    };

    await Hasura(updateUserInterests, variables);
  }

  const response2 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  const cleanedUserDoc = cleanUserdoc(response2.result.data.user[0]);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: cleanedUserDoc,
  });
});

module.exports = updateanUser;
