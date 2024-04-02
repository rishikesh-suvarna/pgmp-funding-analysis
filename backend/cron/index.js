const cron = require('node-cron');
const { fetchUnfinishedData } = require('../utils');

// This cron job runs every day at 12 AM
const task = cron.schedule('* * * * *', async () => {
    await fetchUnfinishedData()
});

// To start the task
task.start();

// To stop the task
// task.stop();

