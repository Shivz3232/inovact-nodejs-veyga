const { query: Hasura } = require('../hasura');

const userInactivityTracker = async () => {
  try {
    // TODO: Fetch user from the DB

    for (const user of users.rows) {
      const { user_id, last_app_opened_timestamp } = user;

      const today = new Date();
      const appOpenedToday = last_app_opened_timestamp >= today.setHours(0, 0, 0, 0) && last_app_opened_timestamp <= today.setHours(23, 59, 59, 999);

      if (appOpenedToday) {
        // TODO: Award points to the user
      } else {
        const lastOpenedDate = new Date(last_app_opened_timestamp);
        const timeDiff = today - lastOpenedDate;
        const consecutiveInactiveDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (consecutiveInactiveDays >= 5) {
          // TODO: decrease points of the user
        }
      }
    }
  } catch (error) {
    console.error('Error checking app opened and updating consecutive days:', error);
  }
};

module.exports = { userInactivityTracker };
