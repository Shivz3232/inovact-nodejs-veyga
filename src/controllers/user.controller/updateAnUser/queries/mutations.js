const updateUser = `mutation updateUser($cognito_sub: String_comparison_exp, $changes: user_set_input) {
  update_user(where: { cognito_sub: $cognito_sub }, _set: $changes) {
    returning {
      id,
      user_name,
      bio,
      avatar,
      phone_number,
      email_id,
      designation,
      organization,
      organizational_role,
      university,
      graduation_year,
      journey_start_date,
      years_of_professional_experience,
      created_at,
      updated_at,
      first_name,
      last_name,
      role,
      cognito_sub,
      admin,
      github_profile,
      cover_photo,
      website,
      profile_complete
    }
  }
}
`;

const addUserSkills = `mutation editUserSkillQuery($user_id: Int!, $objects: [user_skills_insert_input!]!) {
  delete_user_skills(where: { user_id: { _eq: $user_id } }) {
    returning {
      id
      skill
      level
      user_id
    }
  }
  insert_user_skills(objects: $objects, on_conflict: {constraint:  user_skills_skill_user_id_key, update_columns: level}) {
    returning {
      id
      skill
      level
      user_id
    }
  }
}
`;

const updateUserInterests = `mutation updateUserInterests($objects: [user_interests_insert_input!]!, $cognito_sub: String) {
  delete_user_interests(where: {user: {cognito_sub: {_eq: $cognito_sub}}}) {
    affected_rows
  }
  insert_user_interests(objects: $objects) {
    affected_rows
  }
}`;

module.exports = {
  updateUser,
  addUserSkills,
  updateUserInterests,
};
