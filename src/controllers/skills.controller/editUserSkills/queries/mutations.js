const editUserSkillQuery = `mutation editUserSkillQuery($id: Int!, $skill: String, $cognito_sub: String) {
    update_user_skills(where: { id: { _eq: $id }, user : {
      cognito_sub:{_eq:$cognito_sub}
    } }, _set: {skill: $skill }) {
    returning {
      id
      skill
      level
      user_id
    }
    }
  }
`;

const editSkillLevelQuery = `mutation editSkillLevelQuery($id: Int!, $level: String, $cognito_sub: String) {
    update_user_skills(where: { id: { _eq: $id },user : {
      cognito_sub:{_eq:$cognito_sub}
    } }, _set: { level: $level }) {
    returning {
      id
      skill
      level
      user_id
    }
    }
  }
`;

module.exports = {
  editUserSkillQuery,
  editSkillLevelQuery,
};
