'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var timesheetService = require('../services/timesheet_service');
var emailService = require('../services/email_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');

// public
var api = {};

api['sendSingleTimeSheet'] = function(req, res) {
  try {
    var reqData = req.body;
    employeeService.getDetailById(reqData, function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
      if (empRes) {
        var emailHash = helper.getTimesheetData(empRes, 'timesheet.html', reqData.startDate, reqData.endDate);

        getTotalHoursSheetData(emailHash, function(error, dataRes) {
          dataRes['month'] = reqData.month;
          dataRes['year'] = reqData.year;
          dataRes['subject'] = reqData.subject;
          dataRes['message'] = reqData.message;
          dataRes['toEmailIds'] = reqData.toEmailIds;
          if (reqData.ccEmailIds) {
            dataRes['ccEmailIds'] = reqData.ccEmailIds;
          }
          emailService.sendSingleTimeSheet(dataRes, function(error, mailRes) {
            if (error) {
              console.log(error);
              response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), error.stack);
            }
            if (mailRes) {
              console.log(mailRes[0].statusCode);
              response.successResponse(req, res, 'Mail send.');
            }
          });
        });
      } else {
        // no employee found
        console.log('no employee found.');
        response.successResponse(req, res, 'No employee found.');
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

// private
function getTotalHoursSheetData(reqData, callback) {
  timesheetService.getTimesheetByDate(reqData, function(err, timesheetRes, reqData) {
    if (err) return callback(null);
    if (timesheetRes) {
      reqData['timesheetData'] = helper.prepareTimesheetData(timesheetRes);
      reqData['totalHours'] = helper.calculateTotalHours(timesheetRes);
      return callback(null, reqData);
    } else {
      // no timesheet found
      console.log('no timesheet found');
      return callback(null, null);
    }
  });
}

module.exports = api;
