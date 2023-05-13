const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/interest', userController.addAreaOfInterest)
router.delete('/interest' , userController.deleteAreaOfInterest)



router.get('/' , userController.fetchUser)
router.get('/username' , userController.getUsername )
router.put('/' , userController.updateUser)



router.get('/idea' , userController.getUserIdea)
router.get('/project' , userController.getUserProject)
router.get('/teams' , userController.getUserTeams)
router.get('/thoughts' , userController.getUserThoughts)

module.exports = router