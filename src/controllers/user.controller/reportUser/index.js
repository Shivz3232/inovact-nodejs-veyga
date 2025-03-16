const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { reportUserMutation } = require('./queries/mutations');
const { getUserIds } = require('./queries/queries');
const catchAsync = require('../../../utils/catchAsync');

const reportUser = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, user_id, reason } = req.body;

  const userCheckResponse = await Hasura(getUserIds, {
    cognito_sub,
    reported_user_id: user_id,
  });

  if (!userCheckResponse.result.data.reporter.length) {
    return res.status(404).json({
      success: false,
      errorCode: 'ReporterNotFound',
      errorMessage: 'Reporter user not found',
    });
  }

  if (!userCheckResponse.result.data.reported.length) {
    return res.status(404).json({
      success: false,
      errorCode: 'ReportedUserNotFound',
      errorMessage: 'Reported user not found',
    });
  }

  const reporterUserId = userCheckResponse.result.data.reporter[0].id;

  if (reporterUserId === user_id) {
    return res.status(400).json({
      success: false,
      errorCode: 'SelfReport',
      errorMessage: 'You cannot report yourself',
    });
  }

  const reportResponse = await Hasura(reportUserMutation, {
    userId: user_id,
    reportedBy: reporterUserId,
    reason,
  });

  return res.json({
    success: true,
    data: reportResponse.result.data.insert_user_reports_one,
  });
});

module.exports = reportUser;
