const sendMessage = `mutation sendMessage($primary_user_id: Int, $secondary_user_id: Int, $encrypted_message: bytea, $connection_id: Int) {
  insert_private_messages(objects: [{
    primary_user_id: $primary_user_id,
    secondary_user_id: $secondary_user_id,
    encrypted_message: $encrypted_message,
    connection_id: $connection_id
  }]) {
    affected_rows
  }
}`;

module.exports = {
  sendMessage,
};
