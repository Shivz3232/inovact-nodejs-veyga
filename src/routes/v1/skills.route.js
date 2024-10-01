const router = require('express').Router();
const skillController = require('../../controllers/v1/skills.controller');
const { editUserSkillsSanitizer, deleteUserSkillsSanitizer } = require('../../controllers/v1/user.controller/sanitizer');

router.get('/', skillController.getUserSkills);
router.put('/', editUserSkillsSanitizer, skillController.editUserSkills);
router.delete('/', deleteUserSkillsSanitizer, skillController.deleteUserSkills);

module.exports = router;
