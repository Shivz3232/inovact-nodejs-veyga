const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');
const { getJobsQuery, getJobByIdQuery } = require('./queries/queries');

const getJobs = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { jobId } = req.params;

  if (jobId) {
    const jobResponse = await Hasura(getJobByIdQuery, { id: jobId });

    const job = jobResponse.result.data.recruitment_jobs[0];
    if (!job) {
      return res.status(404).json({
        success: false,
        errorCode: 'NotFound',
        errorMessage: 'Job not found',
      });
    }

    return res.json({
      success: true,
      data: job,
    });
  }

  const filters = {};
  const { city, limit = 10, offset = 0 } = req.query;

  if (city) filters.location = { _ilike: `%${city}%` };

  const jobsResponse = await Hasura(getJobsQuery, {
    where: filters,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return res.json({
    success: true,
    data: jobsResponse.result.data.recruitment_jobs,
  });
});

module.exports = getJobs;
