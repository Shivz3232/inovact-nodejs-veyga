const fetchUserEmailFromUserId = `query fetchUserEmailFromUserId($userId :Int) {
  user(where: {id: {_eq: $userId}}){
    email_id
  }
}`;

module.exports = { fetchUserEmailFromUserId };