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
    }
}`;

module.exports = { getUserFeedbackQuery };
