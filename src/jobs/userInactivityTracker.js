const cron = require('node-cron');
const { userInactivityTracker } = require('../workers/userInactivityTracker/index');

const userInactivityTrackerJob = cron.schedule(
  '59 23 * * *',
  () => {
    console.log('Running user inactivity tracker cron job...');
    userInactivityTracker();
  },
  {
    timezone: 'Asia/Kolkata',
  }
);

userInactivityTrackerJob.on('error', (err) => {
  console.error('Error in user inactivity tracker cron job:', err);
});

module.exports = userInactivityTrackerJob;
