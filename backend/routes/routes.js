'use strict';
module.exports = function(app, router) {
  var validate = require('../app_util/routes_helper');
  var authController = require('../rest_controllers/auth_controller');
  var timesheetController = require('../rest_controllers/timesheet_controller');
  var employeeController = require('../rest_controllers/employee_controller');
  var emailController = require('../rest_controllers/email_controller');
  var miscController = require('../rest_controllers/misc_controller');
  var salarySlipController = require('../rest_controllers/salary_slip_controller'); 

  // api routes
  router.post('/auth/login', authController.userLogin);

  // Routes for employee use
  router.get('/employee/detail', validate.validateToken, employeeController.getDetailById);
  router.get('/employee/detail/:id', validate.validateAdminToken, employeeController.getEmployeeDetailById);
  router.put('/employee/reset/password', validate.validateToken, employeeController.resetPassword);
  router.put('/employee/reset/notification', validate.validateToken, employeeController.resetNotification);

  router.get('/timesheet', validate.validateToken, timesheetController.getMonthlyTimeSheet);

  router.get('/ping', miscController.pingServer);

  // Routes for admin use
  router.get('/admin/employee', validate.validateAdminToken, employeeController.getEmployeeList);
  router.get('/admin/employees', validate.validateAdminToken, employeeController.getAllEmployeeList)
  router.get('/admin', validate.validateAdminToken, employeeController.getAdminList);

  router.get('/admin/timesheet', validate.validateAdminToken, timesheetController.getMonthlyTimeSheet);
  router.get('/admin/graph/hoursheet', validate.validateAdminToken, timesheetController.getMonthlyHourSheet);
  router.post('/admin/timesheet/entry', validate.validateAdminToken, timesheetController.addTimeSheetEntryByDate);

  router.put('/admin/email/timesheet', validate.validateAdminToken,
  emailController.sendSingleTimeSheet);

  // Routes for salary slip
  router.post('/admin/upload', validate.validateAdminToken, salarySlipController.uploadSingleFile);
  router.get('/employee/salary_slips', validate.validateAdminToken, salarySlipController.getEmployeeSalarySlips);
  router.get('/admin/send_email', validate.validateAdminToken, salarySlipController.sendMail);
  app.use('/rest', router);
};
