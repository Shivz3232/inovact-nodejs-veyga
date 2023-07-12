const { query: Hasura } = require('../../../utils/hasura');
const { getNetworkStatistics } = require('./queries/queries');
const timeStamps = require('../../../utils/timeStamps');
const catchAsync = require('../../../utils/catchAsync');

const getNetworkStats = catchAsync(async (req, res) => {
  const cognito_sub = req.body.cognito_sub;

  const variables = {
    cognito_sub,
    start_of_last_week: timeStamps.getLastWeekStartDate(),
    end_of_last_week: timeStamps.getLastWeekEndDate(),
    yesterday_morning: timeStamps.getYesterdayStartDate(),
    today_morning: timeStamps.getTodayStartDate(),
  };

  const response = await Hasura(getNetworkStatistics, variables);

  const yesterdaysConnections = response.result.data.connections_till_yesterday_morning.aggregate.count;
  const todaysConnections = response.result.data.connections_till_today_morning.aggregate.count;

  const percentageGrowth = yesterdaysConnections == 0 ? 100 : ((todaysConnections - yesterdaysConnections) / yesterdaysConnections) * 100;

  const statistics = {
    totalConnections: response.result.data.connections_count.aggregate.count,
    lastWeeksConnections: response.result.data.last_weeks_connections.aggregate.count,
    percentageGrowth,
  };

  return res.json({
    success: true,
    errorCode: null,
    errorMessage: null,
    data: statistics,
  });
});

module.exports = getNetworkStats;
