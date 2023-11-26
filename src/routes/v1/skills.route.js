const router = require('express').Router();
const skillController = require('../../controllers/skills.controller');
const { editUserSkillsSanitizer, deleteUserSkillsSanitizer } = require('../../controllers/user.controller/sanitizer');

router.get('/', skillController.getUserSkills);
router.put('/', editUserSkillsSanitizer, skillController.editUserSkills);
router.delete('/', deleteUserSkillsSanitizer, skillController.deleteUserSkills);

module.exports = router;
