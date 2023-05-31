// Note: all these times are in IST
// Queries have been constructed to specifically use these formats.

// Considering Sunday as the last week of the day.
const getLastWeekEndDate = () => {
  const date = new Date();

  // Change the date to the last day of the previous week
  if (date.getDay() == 0) {
    // If today is Sunday
    date.setDate(date.getDate() - 7);
  } else {
    // If today is Monday - Saturday
    date.setDate(date.getDate() - date.getDay());
  }

  // Change time to 23:59:59. Indicates end of the day.
  date.setHours(23, 59, 59);

  return date.toISOString();
};

const getLastWeekStartDate = () => {
  const temp = new Date(getLastWeekEndDate());

  // Go to the first day of the week
  temp.setDate(temp.getDate() - 6);

  // Change time to 00:00:00. Indicates start of the day.
  temp.setHours(0, 0, 0);

  return temp.toISOString();
};

const getYesterdayStartDate = () => {
  const date = new Date();

  date.setDate(date.getDate() - 1);

  // Change time to 00:00:00. Indicates start of the day.
  date.setHours(0, 0, 0);

  return date.toISOString();
};

const getTodayStartDate = () => {
  const date = new Date();

  // Change time to 00:00:00. Indicates start of the day.
  date.setHours(0, 0, 0);

  return date.toISOString();
};

module.exports = {
  getLastWeekStartDate,
  getLastWeekEndDate,
  getYesterdayStartDate,
  getTodayStartDate,
};
