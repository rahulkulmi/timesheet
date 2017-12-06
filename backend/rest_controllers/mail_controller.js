'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var timesheetService = require('../services/timesheet_service');
var emailService = require('../services/email_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');

// private
function getTotalHours(reqData, callback) {
  timesheetService.getWeeklyData(reqData, function(err, timesheetRes) {
    if (err) return callback(null);
    if (timesheetRes) {
      var totalMin = 0;
      timesheetRes.forEach(function(sheet) {
        // console.log(sheet);
        var a = sheet.dayTotal.split(':');
        totalMin = totalMin + (a[0]*60 + a[1]*1);
      });
      var totalHours = helper.convertMinToHour(totalMin);
      callback(totalHours);
    } else {
      // no timesheet found
      console.log('no timesheet found');
      return callback(null);
    }
  });
}

function getTotalHoursData(reqData, callback) {
  timesheetService.getWeeklyData(reqData, function(err, timesheetRes) {
    if (err) return callback(null);
    if (timesheetRes) {
      var resHash = {
        totalHours: '00:00',
        sheetData: helper.prepareTimesheetData(timesheetRes)
      }
      var totalMin = 0;
      timesheetRes.forEach(function(sheet) {
        // console.log(sheet);
        var a = sheet.dayTotal.split(':');
        totalMin = totalMin + (a[0]*60 + a[1]*1);
      });
      resHash['totalHours'] = helper.convertMinToHour(totalMin);
      callback(resHash);
    } else {
      // no timesheet found
      console.log('no timesheet found');
      return callback(null);
    }
  });
}

// public
var api = {};

api['sendWeeklyHourSheet'] = function(req, res) {
  try {
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      if (empRes) {
        var mailData = {
          startDate: helper.getDate(1),
          endDate: helper.getDate(7),
          emailId: 'rahul@newput.com',
          filePath: 'hours.html',
          empData: []
        };
        var recordArray = [];
        var count = 1;
        // console.log('empRes.length');
        // console.log(empRes.length);
        empRes.forEach(function(element) {
          var recordHash = {
            empName: element.fullName,
            totalHours: '00:00'
          };
          var hash = {
            userId: element.id,
            weekStartDate: mailData.startDate,
            weekEndDate: mailData.endDate
          }
          var reqData = helper.prepareWeeklyStartEndDate(hash);
          console.log('reqData');
          console.log(reqData);
          // calculate total hours and timesheet data
          getTotalHoursData(reqData, function(timesheetRes) {
            if (timesheetRes) {
              recordHash['totalHours'] = timesheetRes;
            }
            recordArray.push(recordHash);
            if (empRes.length == count) {
              mailData['empData'] = recordArray;
              emailService.sendWeeklyHourSheet(mailData, function(error, mailRes) {
                if (error) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
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
        console.log('no employee found.');
        response.successResponse(req, res, 'no employee found.');
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['sendWeeklyTimeSheet'] = function(req, res) {
  try {
    var date = new Date();
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      if (empRes) {
        var mailHash = {
          emailId: 'rahul@newput.com',
          filePath: 'timesheet.html',
          empName: '',
          month: helper.getCurrentMonthName(),
          year: helper.getCurrentYear(),
          sheetData: [],
          totalHours: '00:00'
        };
        var count = 1;
        empRes.forEach(function(element) {
          mailHash['empName'] = element.fullName;
          var hash = {
            userId: element.id,
            weekStartDate: helper.getDate(1),
            weekEndDate: helper.getDate(7)
          }
          var reqData = helper.prepareWeeklyStartEndDate(hash);
          // console.log('reqData');
          // console.log(reqData);
          // calculate total hours
          getTotalHoursData(reqData, function(timesheetRes) {
            if (timesheetRes) {
              mailHash['totalHours'] = timesheetRes.totalHours;
              mailHash['sheetData'] = timesheetRes.sheetData;
              // console.log('mailHash');
              // console.log(mailHash);
              emailService.sendWeeklyTimeSheet(mailHash, function(error, mailRes) {
                if (error) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
                if (mailRes) {
                  console.log(mailRes);
                }
              });
            }
            if (empRes.length == count) {
              response.successResponse(req, res, 'end send mail.');
            }
            count += 1;
          });
        });
      } else {
        // no employee found
        console.log('no employee found.');
        response.successResponse(req, res, 'no employee found.');
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};


module.exports = api;
