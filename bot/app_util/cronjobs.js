'use strict';
var crontab = require('node-cron');
var employeeService = require('../services/employee_service');
var coreAPI = require('../services/core_api');

module.exports = function(controller) {
  var bot = controller.spawn();
  var dailyJob = crontab.schedule("30 9,17,22 * * 1-6", function() {
    console.log('Cron daily running.');
    employeeService.getEmployeeList(controller, function(resEmpData) {
      if (resEmpData) {
        resEmpData.forEach(function(emp) {
          if (emp.channelId) {
            console.log('Send daily message to = ' + emp.fullName);
            coreAPI.sendMessage(bot, emp.channelId, 'Please fill your today time sheet.');
          }
        });
      } else {
        console.log('Do not find any employee data.');
      }
    });
  });
};

// module.exports = startCronJobs(controller);
