const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');
const { applyForJobMutation } = require('./queries/mutations');
const { checkJobExistsAndExistingApplicationQuery } = require('./queries/queries');

const applyForJob = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { jobId } = req.params;
  const { name, resume_link, cover_letter } = req.body;
  const { cognito_sub } = req.body;

  const jobAndApplicationCheckResponse = await Hasura(checkJobExistsAndExistingApplicationQuery, {
    id: jobId,
    cognito_sub,
  });

  const job = jobAndApplicationCheckResponse.result.data.jobs_by_pk;
  const user = jobAndApplicationCheckResponse.result.data.user[0];

  if (!job) {
    return res.status(404).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Job not found',
    });
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'User not found',
    });
  }

  if (
    job.job_status !== 'active' ||
    (job.application_deadline && new Date(job.application_deadline) < new Date())
  ) {
    return res.status(400).json({
      success: false,
      errorCode: 'InvalidApplication',
      errorMessage: 'This job is no longer accepting applications',
    });
  }

  if (jobAndApplicationCheckResponse.result.data.applications.length > 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'DuplicateApplication',
      errorMessage: 'You have already applied for this job',
    });
  }

  const applyResponse = await Hasura(applyForJobMutation, {
    object: {
      job_id: jobId,
      applicant_id: user.id,
      name,
      resume_link,
      cover_letter,
      status: 'pending',
      application_date: new Date().toISOString(),
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: applyResponse.result.data.insert_applications_one,
  });
});

module.exports = applyForJob;
