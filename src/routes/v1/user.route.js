const express = require('express');
const userController = require('../../controllers/user.controller');
const userActivityController = require('../../controllers/userActivites.controller/');

const { createUserSanitizer, addAOISanitizer, deactivateUserSanitizer, deleteAOISanitizer, deleteUserSanitizer, fetchUserSanitizer, getUserPostsSanitizer, getUserTeamsSanitizer, updateUserSanitizer, addUserFeedbackSanitizer, getUserFeedbackSanitizer, addUserReferralSanitizer, getStatsSanitizer } = require('../../controllers/user.controller/sanitizer');

//change expected
const { getUserActivitySanitizer, getUserActivitiesSanitizer, insertUserActivitySanitizer } = require('../../controllers/userActivites.controller/sanitizer');

const router = express.Router();

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

//migration to hasura
router.post('/activity', insertUserActivitySanitizer, userActivityController.insertUserActivity);
router.get('/activities', getUserActivitiesSanitizer, userActivityController.getUserActivities);
router.get('/activity/:activityId', getUserActivitySanitizer, userActivityController.getUserActivity);

router.post('/referral', addUserReferralSanitizer, userController.addUserRefferal);

router.get('/getStats', getStatsSanitizer, userController.getStats);

module.exports = router;
