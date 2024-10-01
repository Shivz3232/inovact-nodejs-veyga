const removeProjectComment = `mutation removeProjectComment($id: Int!, $cognitoSub: String!) {
  delete_project_comment(where: { id: { _eq: $id }, user: { cognito_sub: { _eq: $cognitoSub } } }) {
    returning {
      id
    }
  }
}
`;

const removeIdeaComment = `mutation removeIdeaComment($id: Int!, $cognitoSub: String!) {
  delete_idea_comment(where: { id: { _eq: $id }, user: { cognito_sub: { _eq: $cognitoSub } } }) {
    returning{
      id
    }
  }
}
`;

const removeThoughtComment = `mutation removeThoughtComment($id: Int!, $cognitoSub: String) {
  delete_thought_comments(where: { id: { _eq: $id }, user: { cognito_sub: { _eq: $cognitoSub } } }) {
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
