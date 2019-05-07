'use strict';
var crontab = require('node-cron');
var request = require('request');
var log = require('./logger');
var config = require('./config');
var helper = require('./helpers');
var mailcountService = require('../services/mailcount_service');
var employeeService = require('../services/employee_service');
var timesheetService = require('../services/timesheet_service');
var emailService = require('../services/email_service');

// private
function sendHourSheet(EMAIL_IDS) {
  try {
    var reqData = {
      fileName: 'hoursheet.html',
      startDate: helper.getMonthStartDate(),
      endDate: helper.getTodayDate()
    };
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) {
        log.info('Error: employeeService.getEmployeeList()');
        log.info(err);
        return err;
      }
      if (empRes) {
        var recordArray = [];
        var count = 1;
        empRes.forEach(function(element) {
          var mailData = helper.getHoursheetData(reqData);
          mailData['userId'] = element.id;
          var recordHash = {
            empName: element.fullName,
            totalHours: '00:00'
          };
          // calculate total hours
          timesheetService.getTotalHoursByDate(mailData, function(error, dataRes) {
            if (dataRes) {
              recordHash['totalHours'] = dataRes;
            }
            recordArray.push(recordHash);
            if (empRes.length == count) {
              mailData['hoursheetData'] = recordArray;
              mailData['EMAIL_IDS'] = EMAIL_IDS;
              emailService.sendHourSheet(mailData, function(error, mailRes) {
                if (error) {
                  log.info('Error: emailService.sendHourSheet()');
                  log.info(error);
                  return error;
                }
                if (mailRes) {
                  log.info('Mail send successfully.');
                  return true;
                }
              });
            }
            count += 1;
          });
        });
      } else {
        log.info('No employee found.');
        return null;
      }
    });
  } catch (err) {
    log.info('Error: catch()');
    log.info(err);
    return err;
  }
}

function sendTimeSheet(EMAIL_IDS) {
  try {
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) {
        log.info('Error: employeeService.getEmployeeList()');
        log.info(err);
        return err;
      }
      if (empRes) {
        var hashArray = helper.getTimesheetDataArray(empRes, 'timesheet.html', helper.getMonthStartDate(), helper.getTodayDate());

        hashArray.forEach(function(element) {
          getTotalHoursSheetData(element, function(error, dataRes) {
            dataRes['EMAIL_IDS'] = EMAIL_IDS;
            emailService.sendTimeSheet(dataRes, function(error, mailRes) {
              if (error) {
                log.info('Error: emailService.sendTimeSheet()');
                log.info(error);
              }
              if (mailRes) {
                log.info(mailRes[0].statusCode);
              }
            });
          });
        });
        log.info('Mail start sending.');
        return true;
      } else {
        log.info('No employee found.');
        return null;
      }
    });
  } catch (err) {
    log.info('Error: catch()');
    log.info(err);
    return err;
  }
}

function getTotalHoursSheetData(reqData, callback) {
  timesheetService.getTimesheetByDate(reqData, function(err, timesheetRes, reqData) {
    if (err) {
      log.info('Error: timesheetService.getTimesheetByDate()');
      log.info(err);
      return callback(null);
    }
    if (timesheetRes) {
      reqData['timesheetData'] = helper.prepareTimesheetData(timesheetRes);
      reqData['totalHours'] = helper.calculateTotalHours(timesheetRes);
      return callback(null, reqData);
    } else {
      log.info('No timesheet found');
      return callback(null, null);
    }
  });
}

// public
function startCronJobs() {

  // 08:05 PM
  var weekHoursheet = crontab.schedule("35 14 * * 0", function() {
    log.info('Cron weekly hoursheet running.');
    sendHourSheet(config.WEEKLY_EMAIL_IDS);
  });

  // 08:00 PM
  var weekTimesheet = crontab.schedule("30 14 * * 0", function() {
    log.info('Cron weekly timesheet running.');
    sendTimeSheet(config.WEEKLY_EMAIL_IDS);
  });

  // 11:55 PM
  var monthHoursheet31Day = crontab.schedule("25 18 31 1,3,5,7,8,10,12 *", function() {
    log.info('Cron monthly 31Day hoursheet running.');
    sendHourSheet(config.MONTHLY_EMAIL_IDS);
  });

  // 11:59 PM
  var monthTimesheet31Day = crontab.schedule("29 18 31 1,3,5,7,8,10,12 *", function() {
    log.info('Cron monthly 31Day timesheet running.');
    sendTimeSheet(config.MONTHLY_EMAIL_IDS);
  });

  // 11:55 PM
  var monthHoursheet30Day = crontab.schedule("25 18 30 4,6,9,11 *", function() {
    log.info('Cron monthly 30Day hoursheet running.');
    sendHourSheet(config.MONTHLY_EMAIL_IDS);
  });

  // 11:59 PM
  var monthTimesheet30Day = crontab.schedule("29 18 30 4,6,9,11 *", function() {
    log.info('Cron monthly 30Day timesheet running.');
    sendTimeSheet(config.MONTHLY_EMAIL_IDS);
  });

  // 11:55 PM
  var monthHoursheet28Day = crontab.schedule("25 18 28 2 *", function() {
    log.info('Cron monthly 28Day hoursheet running.');
    sendHourSheet(config.MONTHLY_EMAIL_IDS);
  });

  // 11:59 PM
  var monthTimesheet28Day = crontab.schedule("59 18 28 2 *", function() {
    log.info('Cron monthly 28Day timesheet running.');
    sendTimeSheet(config.MONTHLY_EMAIL_IDS);
  });

  var healthJob = crontab.schedule("*/5 * * * *", function() {
    log.info('Cron slack bot server health check running.');
    request(config.BOT_ROOT_PATH + 'ping', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      } else {
        log.info('Send mail to admin Timesheet slack bot server down.');
        mailcountService.getTodayMailCount();
      }
     });
  });
};

module.exports = startCronJobs();
