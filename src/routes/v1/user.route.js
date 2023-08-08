const express = require('express');
const userController = require('../../controllers/user.controller');
const { addAOISanitizer, deactivateUserSanitizer, deleteAOISanitizer, deleteUserSanitizer, fetchUserSanitizer, getUserPostsSanitizer, getUserTeamsSanitizer, updateUserSanitizer } = require('../../controllers/user.controller/sanitizer');

const router = express.Router();

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

module.exports = router;
