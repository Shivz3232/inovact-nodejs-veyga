const cron = require('node-cron');
const { userInactivityTracker } = require('./appEngagementMonitor');

const job = cron.schedule(
  '59 23 * * *',
  () => {
    console.log('Running user inactivity tracker cron job...');
    userInactivityTracker();
  },
  {
    timezone: 'Asia/Kolkata',
  }
);

job.on('error', (err) => {
  console.error('Error in user inactivity tracker cron job:', err);
});
