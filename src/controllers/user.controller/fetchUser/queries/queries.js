const getUser = `query getUser($cognito_sub: String) {
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
    user_name
    bio
    avatar
    phone_number
    email_id
    designation
    organization
    organizational_role
    university
    graduation_year
    journey_start_date
    years_of_professional_experience
    created_at
    updated_at
    first_name
    last_name
    role
    cognito_sub
    admin
    github_profile
    cover_photo
    website
    profile_complete,
    status,
    portfolio_link,
    user_action{
     profile_tutorial_complete
      feed_tutorial_complete
      team_tutorial_complete
      has_uploaded_project
      has_uploaded_idea
      has_uploaded_thought
      has_sought_team
      has_sought_mentor
      has_sought_team_and_mentor
    }
    user_points{
      id
      points
    }
    user_point{
      id
      points
    }
    user_skills {
      id
      skill
      level
    }
    user_interests {
      area_of_interest {
        id
        interest
      }
    }
  }
  connections(where: {id: {_eq: 0}}) {
    status
  }
  connections_aggregate(where: {_or: [ {_and: [{status: {_eq: "connected"}, _or: [{user: {cognito_sub: {_eq: $cognito_sub}}}, {userByUser2: {cognito_sub: {_eq: $cognito_sub}}}]}]}]} ,
         order_by :{formed_at :desc}){
    aggregate{
      count
    }
  }
  team_members_aggregate(where : {
    user:{
     cognito_sub: {
      _eq: $cognito_sub
    }
    }
  }){
    aggregate{
      count
    }
  }
}`;

const getUserById = `query getUser($id: Int, $cognito_sub: String) {
  user(where: {id: {_eq: $id}}) {
    id
    user_name
    bio
    avatar
    phone_number
    email_id
    designation
    organization
    organizational_role
    university
    graduation_year
    journey_start_date
    years_of_professional_experience
    created_at
    updated_at
    first_name
    last_name
    role
    cognito_sub
    admin
    website
    github_profile
    cover_photo
    profile_complete,
    status,
    user_action{
      profile_tutorial_complete
      feed_tutorial_complete
      team_tutorial_complete
      has_uploaded_project
      has_uploaded_idea
      has_uploaded_thought
      has_sought_team
      has_sought_mentor
      has_sought_team_and_mentor
    }
    user_points{
        id
        points
    }
    user_point{
      id
      points
    }
    user_point{
      id
      points
    }
    user_skills {
      id
      skill
      level
    }
    user_interests {
      area_of_interest {
        id
        interest
      }
    }
  }
  connections(where: { _or: [
    {
      _and: [{user1: { _eq: $id }}, {userByUser2: {cognito_sub: { _eq: $cognito_sub }}}]
    },
    {
      _and: [{user: { cognito_sub: { _eq: $cognito_sub }}}, {user2: { _eq: $id }}]
    }
  ]}) {
      status,
      sender_id : user1
    }

    connections_aggregate(where: {_or: [ {_and: [{status: {_eq: "connected"}, _or: [{user: {id: {_eq: $id}}}, {userByUser2: {id: {_eq: $id}}}]}]}]} ,
         order_by :{formed_at :desc}){
    aggregate{
      count
    }
  }
  team_members_aggregate(where : {
    user:{
     id: {
      _eq: $id
    }
    }
  }){
    aggregate{
      count
    }
  }
}`;

const checkIfUserHasBlocked = `query checkIfUserHasBlocked($userId: Int!) {
  user_blocked_users(where: {
    user_id: {_eq: $userId}
  }, limit: 1) {
    user_id
  }
}`;

module.exports = {
  getUser,
  getUserById,
  checkIfUserHasBlocked,
};
