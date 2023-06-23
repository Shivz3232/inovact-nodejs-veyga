const logger = require('../../config/logger');
const catchAsync = require('../../utils/catchAsync');
const { query: Hasura } = require('../../utils/hasura');
const { getSkills, getSkillsWithPrefix } = require('./queries/queries');

const get_Skills = catchAsync(async (req, res) => {
  const prefix = req.query.prefix;

  let response;
  if (prefix) {
    response = await Hasura(getSkillsWithPrefix, {
      _skill: prefix + '%',
    });
  } else {
    response = await Hasura(getSkills);
  }

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json(response.errors);
  }
  return res.json(response.result.data.skills);
});

module.exports = get_Skills;
