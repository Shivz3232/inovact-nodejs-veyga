const checkUserAndReply = `query checkUserAndReply($cognito_sub: String!, $replyId: Int!) {
  post_comment_replies(where: { id: { _eq: $replyId }, user: { cognito_sub: { _eq: $cognito_sub } } }) {
    id
    user {
      id
    }
  }
}
`;

module.exports = {
  checkUserAndReply,
};
