const router = require('express').Router();

const projectController = require('../../controllers/project.controller');
const shareUrl = require('../../middlewares/shareUrl');

router.post('/', projectController.addProject);

router.get('/', shareUrl, projectController.getProject);

router.put('/', projectController.updateProject);

router.delete('/', projectController.deleteProject);

router.post('/like', projectController.likeProject);

module.exports = router;
