const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { createUserQuery, addTutorialCompleteStatus } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const enqueueEmailNotification = require('../../../utils/enqueueEmailNotification');
const insertUserActivity = require('../../../utils/insertUserActivity');
function generateRandomUsername() {
  const min = 1000000000;
  const max = 9999999999;
  const randomUsername = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomUsername.toString();
}

const createUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { email_id, cognito_sub } = req.body;

  const user_name = generateRandomUsername();

  const userData = {
    email_id,
    user_name,
    cognito_sub,
  };

  const createUserQueryResponse = await Hasura(createUserQuery, userData);
  const userId = createUserQueryResponse.result.data.insert_user_one.id;

  await Hasura(addTutorialCompleteStatus, {
    userId,
  });

  // 100 for signup 10 for filling bio
  await Hasura(updateUserPoints, {
    userId,
    points: 110,
  });
  enqueueEmailNotification(13, userId, userId, [userId]);
  insertUserActivity('successful-signup', 'positive', userId, []);

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = createUser;
