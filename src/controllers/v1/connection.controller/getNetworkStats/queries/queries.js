const getNetworkStatistics = `query getNetworkStatistics($cognito_sub: String, $start_of_last_week: timestamptz, $end_of_last_week: timestamptz, $yesterday_morning: timestamptz, $today_morning: timestamptz) {
  connections_count: connections_aggregate(where: { _and: [{status: {_eq: "connected"}}, {_or: [{ user: {cognito_sub: {_eq: $cognito_sub}}}, { userByUser2: {cognito_sub: {_eq: $cognito_sub}}}]}]}) {
    aggregate {
      count
    }
  }
  last_weeks_connections: connections_aggregate(where: { _and: [{status: {_eq: "connected"}}, {_or: [{ user: {cognito_sub: {_eq: $cognito_sub}}}, { userByUser2: {cognito_sub: {_eq: $cognito_sub}}}]}, { formed_at: {_gte: $start_of_last_week, _lt: $end_of_last_week}}]}) {
    aggregate {
      count
    }
  }
  connections_till_yesterday_morning: connections_aggregate(where: { _and: [{status: {_eq: "connected"}}, {_or: [{ user: {cognito_sub: {_eq: $cognito_sub}}}, { userByUser2: {cognito_sub: {_eq: $cognito_sub}}}]}, { formed_at: {_lte: $yesterday_morning}}]}) {
    aggregate {
      count
    }
  }
  connections_till_today_morning: connections_aggregate(where: { _and: [{status: {_eq: "connected"}}, {_or: [{ user: {cognito_sub: {_eq: $cognito_sub}}}, { userByUser2: {cognito_sub: {_eq: $cognito_sub}}}]}, { formed_at: {_lte: $today_morning}}]}) {
    aggregate {
      count
    }
  }
}`;

module.exports = {
  getNetworkStatistics,
};
