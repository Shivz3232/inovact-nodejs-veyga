const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/interest', userController.addAreaOfInterest);
router.delete('/interest', userController.deleteAreaOfInterest);
router.get('/', userController.fetchUser);
router.get('/username', userController.getUsername);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);
router.post('/deactivate', userController.deactivateUser);
router.get('/idea', userController.getUserIdea);
router.get('/post', userController.getUserProject);
router.get('/teams', userController.getUserTeams);
router.get('/thoughts', userController.getUserThoughts);

module.exports = router;
