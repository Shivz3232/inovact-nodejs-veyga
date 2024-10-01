const getUsernameFromEmail = `query getUsernameFromEmail($email: String) {
  user(where: {email_id: {_eq: $email}}) {
    user_name
  }
}`;

module.exports = {
  getUsernameFromEmail,
};
