const getDetails = `query getDetails($notifierId: [Int!], $actorId: Int!) {
  user(where: { id: { _in: $notifierId } }) {
  fcm_token
  }
  actor: user(where: { id: { _eq: $actorId } }) {
    first_name
  }
}`;

const getProjectByTeamId = `query getProject($id: Int) {
  project(where: { team_id: { _eq: $id } }) {
    id,
  }}`;

module.exports = {
  getDetails,
  getProjectByTeamId,
};
