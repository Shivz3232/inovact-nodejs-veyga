const { query: Hasura } = require('./utils/hasura');

//get all user ids
async function getUserIds() {
  let idsArray;
  try {
    const response = await Hasura('query { user { id } }', {});
    idsArray = response.result.data.user.map((user) => user.id);

    const query = `mutation addTutorialCompleteStatus($id: Int!) {
  insert_user_actions(
    objects: [
      {
        user_id: $id
      }
    ],
    on_conflict: {
      constraint: user_actions_pkey,  # Replace with your actual constraint name
      update_columns: []  # List of columns to update if conflict occurs (empty for skipping)
    }
  ) {
    affected_rows
  }
}`;

    idsArray.forEach(async (id) => await Hasura(query, { id }));
  } catch (err) {
    console.log(err);
  }
}

getUserIds();
