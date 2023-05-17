const router = require('express').Router()

const projectController = require('../../controllers/project.controller')


router.post('/' , projectController.addProject)

router.get('/' , projectController.getProject)

router.put('/' , projectController.updateProject)

router.delete('/' , projectController.deleteProject)

router.post('/like' , projectController.likeProject)

module.exports = router