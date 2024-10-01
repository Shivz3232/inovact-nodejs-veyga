const getUserFeedbackQuery = `query getUserFeedback($id: Int!) {        
    user_feedback(where: {
      id: {
        _eq: $id
      }
    }
    ) {
      id
      user_id
      subject
      body
      email_id
    }
}`;

module.exports = { getUserFeedbackQuery };
