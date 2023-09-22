const getDetails = `query getDetails($notifierId: [Int!], $actorId: Int!) {
  user(where: { id: { _in: $notifierId } }) {
  fcm_token
  }
  actor: user(where: { id: { _eq: $actorId } }) {
    first_name
  }
}`;

module.exports = {
  getDetails,
};
