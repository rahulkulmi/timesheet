'use strict';
module.exports = function(app, router) {
  // var validate = require('../app_util/routes_helper');
  // var authController = require('../rest_controllers/auth_controller');
  var timesheetController = require('../rest_controllers/timesheet_controller');
  var employeeController = require('../rest_controllers/employee_controller');
  var mailController = require('../rest_controllers/mail_controller');

  // api routes
  router.get('/employee/detail', employeeController.getDetailById);
  router.post('/employee/email', employeeController.sendMailToUserId);
  router.get('/timesheet/weekly', mailController.sendWeeklyTimeSheet);
  // router.get('/timesheet/monthly', mailController.sendMonthlyTimeSheet);
  router.get('/hoursheet/weekly', mailController.sendWeeklyHourSheet);
  // router.get('/hoursheet/monthly', mailController.sendMonthlyHourSheet);
  // router.get('/auth/status', validate.validateDeviceIdDeviceToken, authController.userStatus);

  app.use('/rest', router);
};
