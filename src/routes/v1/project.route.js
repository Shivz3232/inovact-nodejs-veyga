const router = require('express').Router();
const projectController = require('../../controllers/project.controller');
const multerUpload = require('../../utils/multerUpload');
const { addProjectSanitizer, deleteProjectSanitizer, getProjectSanitizer, updateProjectSanitizer, likeProjectSanitizer } = require('../../controllers/project.controller/sanitizer');

router.post('/', addProjectSanitizer, projectController.addProject);

router.get('/', getProjectSanitizer, projectController.getProject);

router.put('/', updateProjectSanitizer, projectController.updateProject);

router.delete('/', deleteProjectSanitizer, projectController.deleteProject);

router.post('/like', likeProjectSanitizer, projectController.likeProject);

module.exports = router;
