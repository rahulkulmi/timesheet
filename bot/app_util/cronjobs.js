'use strict';
var crontab = require('node-cron');
var request = require('request');
var appMessages = require('./app_messages');
var helper = require('./helper');
var employeeService = require('../services/employee_service');
var emailService = require('../services/email_service');
var mailcountService = require('../services/mailcount_service');
var timesheetService = require('../services/timesheet_service');
var coreAPI = require('../services/core_api');

module.exports = function(controller) {
  var bot = controller.spawn();
  // 0 4,12,17 * * 1-6
  var dailyJob = crontab.schedule("0 4,12,17 * * 1-6", function() {
    console.log('Cron daily running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId) {
            var date = helper.getTodayDate();
            var userId = emp.id;
            timesheetService.getDetailById(controller, date, userId, emp,  function(resTimeData) {
              if (resTimeData.data) {
                // console.log(resTimeData);
                console.log('Do not send daily message to employee = ' + resTimeData.emp.fullName);
              } else {
                console.log('Send daily message to employee = ' + resTimeData.emp.fullName);
                var dailyMsg = 'Hey ' + resTimeData.emp.fullName + appMessages.cronDaily;
                coreAPI.sendMessage(bot, emp.channelId, dailyMsg);
              }
            });
          }
        });
      } else {
        console.log('Do not find any employee data.');
      }
    });
  });

  // 30 14 * * 0
  var weekendJob = crontab.schedule("30 14 * * 0", function() {
    console.log('Cron weekend running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId) {
            var date = helper.getDate(-1);
            // var date = '08-01-2018';
            // console.log('2 days before date value', helper.getDate(-1));
            // console.log('today date value', helper.getTodayDate());
            var userId = emp.id;
            timesheetService.getDetailById(controller, date, userId, emp,  function(resTimeData) {
              if (resTimeData.data) {
                // console.log(resTimeData);
                console.log('Do not send weekly message to employee = ' + resTimeData.emp.fullName);
              } else {
                console.log('Send weekly message to employee = ' + resTimeData.emp.fullName);
                var weeklyMsg = 'Hey ' + resTimeData.emp.fullName + appMessages.cronWeekly;
                coreAPI.sendMessage(bot, emp.channelId, weeklyMsg);
              }
            });
          }
        });
      } else {
        console.log('Do not find any employee data.');
      }
    });
  });

  // Check backend server health
  var healthJob = crontab.schedule("*/5 * * * *", function() {
    console.log('Cron backend server health check running.');
    request(bot.botkit.config.rootPath + 'ping', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log('body');
        console.log(body);
      } else {
        console.log('Send mail to admin Timesheet backend server down.');
        mailcountService.getTodayMailCount(controller, function(resMailcountData) {
          if (resMailcountData) {
            // here check count if count is 4 send mail.
            if (resMailcountData.count == 4) {
              emailService.sendNotificationMail(bot);
            } else {
              console.log('Mail count value : ', resMailcountData.count);
            }
          } else {
            console.log('Do not find any mailcount data.');
          }
        });
      }
     });
  });
};

// module.exports = startCronJobs(controller);
