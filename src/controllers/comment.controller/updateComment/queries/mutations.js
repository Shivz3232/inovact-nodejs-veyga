const updateProjectComment = `mutation updateProjectComment($id: Int!, $userId: Int!, $text: String!) {
  update_project_comment(where: { id: { _eq: $id }, user_id: { _eq: $userId } }, _set: { text: $text }) {
    returning{
      id
      created_at
      updated_at
      text
      user_id
      project_id
    }
  }
}
`;

const updateIdeaComment = `mutation updateIdeaComment($id: Int!, $userId: Int!, $text: String!) {
  update_idea_comment(where: { id: { _eq: $id }, user_id: { _eq: $userId } }, _set: { text: $text }) {
    returning{
      id
      created_at
      updated_at
      text
      user_id
      idea_id
    }
  }
}`;

const updateThoughtComment = `mutation updateThoughtComment($id: Int!, $userId: Int!, $text: String!) {
  update_thought_comments(where: { id: { _eq: $id }, user_id: { _eq: $userId } }, _set: { text: $text }) {
    returning{
      id
      created_at
      updated_at
      text
      user_id
      thought_id
    }
  }
}`;

module.exports = {
  updateProjectComment,
  updateIdeaComment,
  updateThoughtComment,
};
