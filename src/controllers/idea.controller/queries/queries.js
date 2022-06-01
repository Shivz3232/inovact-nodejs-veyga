const getIdeas = `query getIdeas($cognito_sub: String) {
    idea(order_by: {created_at:desc}) {
      id
      title
      description
      user_id
      team_id
      status
      idea_tags {
        hashtag {
          name
        }
      }
      idea_likes: idea_likes_aggregate {
        result: aggregate {
          count
        }
      }
      has_liked: idea_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
        result: aggregate {
          count
        }
      }
      idea_comments {
        id
        created_at
        text
        updated_at
        user {
          id
          first_name
          last_name
          avatar
        }
      }
      created_at
      updated_at
      user {
        id
        avatar
        first_name
        last_name
        role
      }
      team {
        id
        looking_for_members
        looking_for_mentors
      }
    }
  }
  `;

const getIdea = `query getIdea($id: Int, $cognito_sub: String) {
    idea (where: { id: { _eq: $id }}) {
      id
      title
      description
      team_id
      user_id
      status
      idea_tags {
        hashtag {
          name
        }
      }
      idea_likes: idea_likes_aggregate {
        result: aggregate {
          count
        }
      }
      has_liked: idea_likes_aggregate (where: { user: { cognito_sub: {_eq: $cognito_sub}}}) {
        result: aggregate {
          count
        }
      }
      idea_comments {
        id
        created_at
        text
        updated_at
        user {
          id
          first_name
          last_name
          avatar
        }
      }
      user {
        id
        avatar
        first_name
        last_name
        role
      }
      team {
        id
        looking_for_members
        looking_for_mentors
      }
      created_at
      updated_at
    }
  }
  `;

const getConnections = `query getConnections($cognito_sub: String) {
  connections(where: {
    _or: [
      { user: {cognito_sub: {_eq: $cognito_sub }}},
      { userByUser2: {cognito_sub: {_eq: $cognito_sub }}}
    ]
  }) {
    user1
    user2
    status
  }
  user (where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;

module.exports = {
    getIdea,
    getIdeas,
    getConnections,
};
