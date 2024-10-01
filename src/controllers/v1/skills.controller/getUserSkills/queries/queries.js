const getSkillsWithPrefix = `query getSkills($_skill: String!) {
    skills(
      where:{
        name:{
          _ilike:$_skill
        }
      }
    ){
      id,
      name,
    }
  }`;

const getSkills = `query getSkills {
  skills {
    id
    name
  }
}`;

module.exports = {
  getSkills,
  getSkillsWithPrefix,
};
