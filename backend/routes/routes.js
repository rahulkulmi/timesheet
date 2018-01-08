'use strict';
module.exports = function(app, router) {
  var validate = require('../app_util/routes_helper');
  var authController = require('../rest_controllers/auth_controller');
  var timesheetController = require('../rest_controllers/timesheet_controller');
  var employeeController = require('../rest_controllers/employee_controller');
  var emailController = require('../rest_controllers/email_controller');
  var miscController = require('../rest_controllers/misc_controller');

  // api routes
  router.post('/auth/login', authController.userLogin);

  // Routes for employee use
  router.get('/employee/detail', validate.validateToken, employeeController.getDetailById);
  router.put('/employee/reset/password', validate.validateToken, employeeController.resetPassword);

  router.get('/timesheet', validate.validateToken, timesheetController.getMonthlyTimeSheet);

  router.get('/email/timesheet', emailController.sendTimeSheet);
  router.get('/email/hoursheet', emailController.sendHourSheet);

  router.get('/ping', miscController.pingServer);

  // router.get('/auth/status', validate.validateDeviceIdDeviceToken, authController.userStatus);

  // Routes for admin use
  router.get('/admin/employee', validate.validateAdminToken, employeeController.getEmployeeList);

  router.get('/admin/timesheet', validate.validateAdminToken, timesheetController.getMonthlyTimeSheet);

  app.use('/rest', router);
};
