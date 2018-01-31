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
  // 9:30, 5:30, 10:30 (mon-sat)
  var dailyJob = crontab.schedule("0 4,12,17 * * 1-6", function() {
    console.log('Cron daily running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId && emp.notificationStatus === true) {
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

  // 07:00 PM
  var weekendJob = crontab.schedule("30 13 * * 0", function() {
    console.log('Cron weekend running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId && emp.notificationStatus === true) {
            var date = helper.getDate(-2);
            // console.log('2 days before date value', helper.getDate(-1));
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

  // 10:00 PM
  var month31DayJob = crontab.schedule("30 16 31 1,3,5,7,8,10,12 *", function() {
    console.log('Cron 31 days monthend notification running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId && emp.notificationStatus === true) {
            console.log('Send monthend message to every employee = ' + emp.fullName);
            var monthEndMsg = 'Hey ' + resTimeData.emp.fullName + appMessages.cronMonthEnd;
            coreAPI.sendMessage(bot, emp.channelId, monthEndMsg);
          }
        });
      } else {
        console.log('Do not find any employee data.');
      }
    });
  });

  // 09:00 PM
  var month30DayJob = crontab.schedule("30 15 30 4,6,9,11 *", function() {
    console.log('Cron 30 days monthend notification running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId && emp.notificationStatus === true) {
            console.log('Send monthend message to every employee = ' + emp.fullName);
            var monthEndMsg = 'Hey ' + resTimeData.emp.fullName + appMessages.cronMonthEnd;
            coreAPI.sendMessage(bot, emp.channelId, monthEndMsg);
          }
        });
      } else {
        console.log('Do not find any employee data.');
      }
    });
  });

  // 09:00 PM
  var month28DayJob = crontab.schedule("30 15 28 2 *", function() {
    console.log('Cron 28 days monthend notification running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId && emp.notificationStatus === true) {
            console.log('Send monthend message to every employee = ' + emp.fullName);
            var monthEndMsg = 'Hey ' + resTimeData.emp.fullName + appMessages.cronMonthEnd;
            coreAPI.sendMessage(bot, emp.channelId, monthEndMsg);
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
