const express = require('express');
const jobController = require('../../controllers/job.controller');
const {
  getJobsSanitizer,
  getJobByIdSanitizer,
  applyForJobSanitizer,
} = require('../../controllers/job.controller/sanitizer');

const router = express.Router();

router.get('/', getJobsSanitizer, jobController.getJobs);
router.get('/eligible', getJobsSanitizer, jobController.eligibleForJob);
router.get('/:jobId', getJobByIdSanitizer, jobController.getJobs);
router.post('/:jobId/apply', applyForJobSanitizer, jobController.applyForJob);

module.exports = router;
