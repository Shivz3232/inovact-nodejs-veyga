const acceptConnection = `mutation acceptConnection($user1: Int, $user2: Int, $formedAt: timestamptz) {
    update_connections(_set: { status: "connected", formed_at: $formedAt}, where: { user1: { _eq: $user1 }, user2: { _eq: $user2 }}) {
      returning {
        status
      }
    }
  }`;

module.exports = {
  acceptConnection,
};
