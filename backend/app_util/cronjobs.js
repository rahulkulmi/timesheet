'use strict';
var crontab = require('node-crontab');
var request = require('request');
var log = require('./logger');

function startCronJobs() {

  var weekHoursheetJob = crontab.scheduleJob("35 15 * * 0", function() {
    request('http://34.211.76.6:9095/rest/email/hoursheet', function (error, response, body) {
      log.info('Cron weekly hoursheetJob running.');
     });
  });

  var weekTimesheetJob = crontab.scheduleJob("30 15 * * 0", function() {
    request('http://34.211.76.6:9095/rest/email/timesheet', function (error, response, body) {
      log.info('Cron weekly timesheetJob running.');
     });
  });

  var monthHoursheetJob = crontab.scheduleJob("54 23 28 * *", function() {
    request('http://34.211.76.6:9095/rest/email/hoursheet', function (error, response, body) {
      log.info('Cron monthly hoursheetJob running.');
     });
  });

  var monthTimesheetJob = crontab.scheduleJob("59 23 28 * *", function() {
    request('http://34.211.76.6:9095/rest/email/timesheet', function (error, response, body) {
      log.info('Cron monthly timesheetJob running.');
     });
  });
};

module.exports = startCronJobs();
