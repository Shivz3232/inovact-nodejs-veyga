const router = require('express').Router();
const projectController = require('../../controllers/v2/project.controller');
const { getProjectSanitizer } = require('../../controllers/v2/project.controller/sanitizer');

router.get('/', getProjectSanitizer, projectController.getProject);

module.exports = router;
