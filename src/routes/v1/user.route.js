const express = require('express');

const userActionController = require('../../controllers/userAction.controller');
const userController = require('../../controllers/user.controller');
const userActivityController = require('../../controllers/userActivites.controller');
const phoneNumberController = require('../../controllers/phoneNumber.controller');

const {
  getUserActionsSanitizer,
  updateUserActionSanitizer,
  reportUserSanitizer,
  blockUserSanitizer,
  unblockUserSanitizer,
} = require('../../controllers/userAction.controller/sanitizer');
const {
  createUserSanitizer,
  addAOISanitizer,
  deactivateUserSanitizer,
  deleteAOISanitizer,
  deleteUserSanitizer,
  fetchUserSanitizer,
  getUserPostsSanitizer,
  getUserTeamsSanitizer,
  updateUserSanitizer,
  addUserFeedbackSanitizer,
  getUserFeedbackSanitizer,
  addUserReferralSanitizer,
  getStatsSanitizer,
} = require('../../controllers/user.controller/sanitizer');
const {
  getUserActivitySanitizer,
  getUserActivitiesSanitizer,
  insertUserActivitySanitizer,
} = require('../../controllers/userActivites.controller/sanitizer');
const {
  verifyPhoneNumberSanitizer,
  addPhoneNumberSanitizer,
} = require('../../controllers/phoneNumber.controller/sanitizer');

const router = express.Router();

// Add the route (find an appropriate location in the existing routes)
router.post('/', createUserSanitizer, userController.createUser);

router.post('/interest', addAOISanitizer, userController.addAreaOfInterest);
router.delete('/interest', deleteAOISanitizer, userController.deleteAreaOfInterest);

router.get('/', fetchUserSanitizer, userController.fetchUser);
router.get('/username', userController.getUsername);
router.put('/', updateUserSanitizer, userController.updateUser);

router.delete('/', deleteUserSanitizer, userController.deleteUser);
router.post('/deactivate', deactivateUserSanitizer, userController.deactivateUser);

router.get('/idea', getUserPostsSanitizer, userController.getUserIdea);
router.get('/post', getUserPostsSanitizer, userController.getUserProject);
router.get('/team', getUserTeamsSanitizer, userController.getUserTeams);
router.get('/thought', getUserPostsSanitizer, userController.getUserThoughts);

router.post('/feedback', addUserFeedbackSanitizer, userController.addUserFeedback);
router.get('/feedback', getUserFeedbackSanitizer, userController.getUserFeedback);

// user activities
router.post('/activity', insertUserActivitySanitizer, userActivityController.insertUserActivity);
router.get('/activities', getUserActivitiesSanitizer, userActivityController.getUserActivities);
router.get(
  '/activity/:activityId',
  getUserActivitySanitizer,
  userActivityController.getUserActivity
);

// referral
router.post('/referral', addUserReferralSanitizer, userController.addUserRefferal);

// user stats
router.get('/getStats', getStatsSanitizer, userController.getStats);

// user actions
router.get('/actions', getUserActionsSanitizer, userActionController.getUserActions);
router.put('/actions', updateUserActionSanitizer, userActionController.updateUserActions);

router.post('/:userId/report', reportUserSanitizer, userActionController.reportUser);
router.post('/:userId/block', blockUserSanitizer, userActionController.blockUser);
router.post('/:userId/unblock', unblockUserSanitizer, userActionController.unblockUser);

router.post('/phonenumber', addPhoneNumberSanitizer, phoneNumberController.addPhoneNumber);
router.post(
  '/phonenumber/verify',
  verifyPhoneNumberSanitizer,
  phoneNumberController.verifyPhoneNumber
);

module.exports = router;
