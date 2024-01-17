const addUserFeedbackQuery = `mutation addFeedback($userId: Int!, $subject: String, $body: String) {
  insert_user_feedback(objects: {
    user_id: $userId,
    subject: $subject,
    body: $body
  }) {
    returning {
      id
      user_id
      subject
      body
    }
  }
}`;

module.exports = { addUserFeedbackQuery };
