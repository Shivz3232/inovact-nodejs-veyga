const getCommentReplies = `
  query GetNestedReplies($commentId: Int!, $limit: Int!, $offset: Int!) {
    post_comment_replies(
      where: { comment_id: { _eq: $commentId }, parent_reply_id: { _is_null: true } }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      id
      text
      created_at
      user {
        id
        avatar
        first_name
        last_name
        role
      }
      post_comment_replies {
        id
        text
        created_at
        user {
          id
          avatar
          first_name
          last_name
          role
        }
        post_comment_replies {
          id
          text
          created_at
          user {
            id
            avatar
            first_name
            last_name
            role
          }
        }
      }
    }
    post_comment_replies_aggregate(
      where: { comment_id: { _eq: $commentId }, parent_reply_id: { _is_null: true } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const checkIfUserExists = `query getUser($cognito_sub: String) {
  user(where: { cognito_sub: { _eq: $cognito_sub }}) {
    id
  }
}
`;

module.exports = { getCommentReplies, checkIfUserExists };
