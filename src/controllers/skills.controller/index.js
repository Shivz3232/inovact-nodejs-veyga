const catchAsync = require('../../utils/catchAsync');
const { query: Hasura } = require('../../utils/hasura');
const { getSkills, getSkillsWithPrefix } = require('./queries/queries');

const get_Skills = catchAsync(async (req,res)=>{
  const prefix = req.body.prefix;

  let response;
  if (prefix) {
    response = await Hasura(getSkillsWithPrefix, {
      _skill: prefix + '%',
    });
  } else {
    response = await Hasura(getSkills);
  }

  if (response.success) {
    res.json(response.result.data.skills);
  } else {
    res.json(response.errors);
  }
});

module.exports = get_Skills
