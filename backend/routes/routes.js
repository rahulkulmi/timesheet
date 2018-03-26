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
  router.put('/employee/reset/notification', validate.validateToken, employeeController.resetNotification);

  router.get('/timesheet', validate.validateToken, timesheetController.getMonthlyTimeSheet);

  router.get('/email/timesheet', emailController.sendTimeSheet);
  router.get('/email/hoursheet', emailController.sendHourSheet);

  router.get('/ping', miscController.pingServer);

  // Routes for admin use
  router.get('/admin/employee', validate.validateAdminToken, employeeController.getEmployeeList);
  router.get('/admin', validate.validateAdminToken, employeeController.getAdminList);

  router.get('/admin/timesheet', validate.validateAdminToken, timesheetController.getMonthlyTimeSheet);
  router.get('/admin/graph/hoursheet', validate.validateAdminToken, timesheetController.getMonthlyHourSheet);
  router.post('/timesheet/entry', validate.validateAdminToken, timesheetController.addTimeSheetEntryByDate);

  router.put('/email/emptimesheet', validate.validateAdminToken,
  emailController.sendSingleTimeSheet);

  app.use('/rest', router);
};
