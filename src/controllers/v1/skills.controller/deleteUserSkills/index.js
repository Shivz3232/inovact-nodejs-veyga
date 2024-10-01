const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../../utils/hasura');
const { deleteUserSkill } = require('./queries/mutations');
const catchAsync = require('../../../../utils/catchAsync');

const deleteUserSkills = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: sanitizerErrors.array(),
    });
  }

  const { skillIds, cognito_sub } = req.body;

  if (Array.isArray(skillIds) && skillIds.length > 0) {
    await Promise.all(
      skillIds.map(async (skillId) => {
        await Hasura(deleteUserSkill, {
          id: skillId,
          cognito_sub,
        });
      })
    );
  }

  return res.status(204).json({
    success: true,
    errors: [],
  });
});

module.exports = deleteUserSkills;
