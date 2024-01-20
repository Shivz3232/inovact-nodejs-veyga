const addUserFeedbackQuery = `mutation addFeedback($userId: Int!, $subject: String, $body: String, $email_id: String) {
  insert_user_feedback(objects: {
    user_id: $userId,
    subject: $subject,
    body: $body
    email_id: $email_id
  }) {
    returning {
      id
      user_id
      subject
      body
      email_id
    }
  }
}`;

module.exports = { addUserFeedbackQuery };
