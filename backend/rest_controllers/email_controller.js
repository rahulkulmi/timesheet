'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var timesheetService = require('../services/timesheet_service');
var emailService = require('../services/email_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');

// public
var api = {};

api['sendHourSheet'] = function(req, res) {
  try {
    var reqData = {
      fileName: 'hoursheet.html',
      startDate: helper.getMonthStartDate(),
      endDate: helper.getTodayDate()
    };
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
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
              emailService.sendHourSheet(mailData, function(error, mailRes) {
                if (error) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), error);
                if (mailRes) {
                  response.successResponse(req, res, mailRes);
                }
              });
            }
            count += 1;
          });
        });
      } else {
        // no employee found
        console.log('No employee found.');
        response.successResponse(req, res, 'No employee found.');
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['sendTimeSheet'] = function(req, res) {
  try {
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
      if (empRes) {
        var hashArray = helper.getTimesheetDataArray(empRes, 'timesheet.html', helper.getMonthStartDate(), helper.getTodayDate());

        hashArray.forEach(function(element) {
          getTotalHoursSheetData(element, function(error, dataRes) {
            emailService.sendTimeSheet(dataRes, function(error, mailRes) {
              if (error) {
                console.log(error);
              }
              if (mailRes) {
                console.log(mailRes[0].statusCode);
              }
            });
          });
        });
        response.successResponse(req, res, 'Mail start sending.');
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
