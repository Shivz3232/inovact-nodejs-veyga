const getLastAppOpenedTimestamp = `query getUsers{
  user_actions{
    user_id,
    last_app_opened_timestamp
  }
}`;

module.exports = { getLastAppOpenedTimestamp };
