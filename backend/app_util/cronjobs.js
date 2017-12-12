'use strict';
var crontab = require('node-cron');
var request = require('request');
var log = require('./logger');
var config = require('./config');

function startCronJobs() {

  var weekHoursheet = crontab.schedule("35 15 * * 0", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron weekly hoursheet running.');
     });
  });

  var weekTimesheet = crontab.schedule("30 15 * * 0", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron weekly timesheet running.');
     });
  });

  var monthHoursheet31Day = crontab.schedule("54 23 31 1,3,5,7,8,10,12 *", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron monthly 31Day hoursheet running.');
     });
  });

  var monthTimesheet31Day = crontab.schedule("59 23 31 1,3,5,7,8,10,12 *", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron monthly 31Day timesheet running.');
     });
  });

  var monthHoursheet30Day = crontab.schedule("54 23 30 4,6,9,11 *", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron monthly 30Day hoursheet running.');
     });
  });

  var monthTimesheet30Day = crontab.schedule("59 23 30 4,6,9,11 *", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron monthly 30Day timesheet running.');
     });
  });

  var monthHoursheet28Day = crontab.schedule("54 23 28 2 *", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron monthly 28Day hoursheet running.');
     });
  });

  var monthTimesheet28Day = crontab.schedule("59 23 28 2 *", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron monthly 28Day timesheet running.');
     });
  });
};

module.exports = startCronJobs();
