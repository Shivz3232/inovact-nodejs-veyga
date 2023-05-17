const addUserInterests = `mutation addUserInterests($objects: [user_interests_insert_input!]!) {
  insert_user_interests(objects: $objects) {
    affected_rows
  }
}`;

module.exports = {
  addUserInterests,
};
