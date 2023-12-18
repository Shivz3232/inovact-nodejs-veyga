const removeProjectComment = `mutation removeProjectComment($id: Int!, $userId: Int!) {
  delete_project_comment(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
    returning{
      id
    }
  }
}
`;

const removeIdeaComment = `mutation removeIdeaComment($id: Int!, $userId: Int!) {
  delete_idea_comment(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
    returning{
      id
    }
  }
}
`;

const removeThoughtComment = `mutation removeThoughtComment($id: Int!, $userId: Int!) {
  delete_thought_comments(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
    returning{
      id
    }
  }
}
`;

module.exports = {
  removeProjectComment,
  removeIdeaComment,
  removeThoughtComment,
};
