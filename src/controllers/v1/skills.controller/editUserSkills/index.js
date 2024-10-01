const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { editUserSkillQuery, editSkillLevelQuery } = require('./queries/mutations');
const catchAsync = require('../../../../utils/catchAsync');

const editUserSkills = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  const { cognito_sub, skillId } = req.body;

  let updatedContent = null;

  if (req.body.skillLevel) {
    const response = await Hasura(editSkillLevelQuery, {
      id: skillId,
      level: req.body.skillLevel,
      cognito_sub,
    });

    updatedContent = response.result.data.update_user_skills.returning[0];
  }

  if (req.body.skillName) {
    const response = await Hasura(editUserSkillQuery, {
      id: skillId,
      skill: req.body.skillName,
      cognito_sub,
    });

    updatedContent = response.result.data.update_user_skills.returning[0];
  }

  return res.status(200).json({
    success: true,
    errors: [],
    data: updatedContent,
  });
});

module.exports = editUserSkills;
