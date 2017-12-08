'use strict';
module.exports = function(app, router) {
  var validate = require('../app_util/routes_helper');
  var authController = require('../rest_controllers/auth_controller');
  var timesheetController = require('../rest_controllers/timesheet_controller');
  var employeeController = require('../rest_controllers/employee_controller');
  var emailController = require('../rest_controllers/email_controller');

  // api routes
  router.get('/employee/detail', validate.validateToken, employeeController.getDetailById);
  // router.post('/employee/email', employeeController.sendMailToUserId);
  router.get('/email/timesheet', emailController.sendTimeSheet);
  router.get('/email/hoursheet', emailController.sendHourSheet);
  router.post('/auth/login', authController.userLogin);
  // router.get('/auth/status', validate.validateDeviceIdDeviceToken, authController.userStatus);

  app.use('/rest', router);
};
