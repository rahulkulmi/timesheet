'use strict';
var crontab = require('node-crontab');
var request = require('request');
var log = require('./logger');

function startCronJobs() {

  var hoursheetJob = crontab.scheduleJob("5 20 * * THU", function() {
    request('http://localhost:9095/rest/hoursheet/weekly', function (error, response, body) {
      log.info('Cron hoursheetJob running.');
     });
  });

  var timesheetJob = crontab.scheduleJob("0 20 * * THU", function() {
    request('http://localhost:9095/rest/timesheet/weekly', function (error, response, body) {
      log.info('Cron timesheetJob running.');
     });
  });
};

module.exports = startCronJobs();
