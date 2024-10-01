const catchAsync = require('../../../../utils/catchAsync');
const { query: Hasura } = require('../../../../utils/hasura');
const { getSkills, getSkillsWithPrefix } = require('./queries/queries');

const getUserSkills = catchAsync(async (req, res) => {
  const { prefix } = req.query;

  let response;
  if (prefix) {
    response = await Hasura(getSkillsWithPrefix, {
      _skill: `${prefix}%`,
    });
  } else {
    response = await Hasura(getSkills);
  }

  return res.json(response.result.data.skills);
});

module.exports = getUserSkills;
