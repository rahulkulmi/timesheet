'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var timesheetService = require('../services/timesheet_service');
var emailService = require('../services/email_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');

// public
var api = {};

api['sendWeeklyHourSheet'] = function(req, res) {
  try {
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      if (empRes) {
        // var mailData = {
        //   startDate: helper.getDate(1),
        //   endDate: helper.getDate(7),
        //   emailId: 'rahul@newput.com',
        //   filePath: 'hours.html',
        //   empData: []
        // };

        var recordArray = [];
        var count = 1;

        empRes.forEach(function(element) {
          var mailData = getHourData('hoursheet.html', helper.getDate(1), helper.getDate(7));
          mailData['userId'] = element.id;
          var recordHash = {
            empName: element.fullName,
            totalHours: '00:00'
          };
          // var hash = {
          //   userId: element.id,
          //   startDate: mailData.startDate,
          //   endDate: mailData.endDate
          // }
          // var reqData = helper.prepareWeeklyStartEndDate(mailData);
          // console.log('reqData');
          // console.log(reqData);
          // calculate total hours
          getTotalHoursSheetData(mailData, function(error, dataRes) {
            if (dataRes) {
              recordHash['totalHours'] = dataRes.totalHours;
            }
            recordArray.push(recordHash);
            if (empRes.length == count) {
              mailData['hourSheetData'] = recordArray;
              emailService.sendHourSheet(mailData, function(error, mailRes) {
                if (error) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
                if (mailRes) {
                  response.successResponse(req, res, mailRes);
                }
              });
            }
            count += 1;
          });
          // getTotalHours(mailData, function(timesheetRes) {
          //   if (timesheetRes) {
          //     recordHash['totalHours'] = timesheetRes;
          //   }
          //   recordArray.push(recordHash);
          //   if (empRes.length == count) {
          //     mailData['empData'] = recordArray;
          //     emailService.sendHourSheet(mailData, function(error, mailRes) {
          //       if (error) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
          //       if (mailRes) {
          //         response.successResponse(req, res, mailRes);
          //       }
          //     });
          //   }
          //   count += 1;
          // });
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
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      if (empRes) {
        var hashArray = getSheetDataArray(empRes, 'timesheet.html', helper.getDate(1), helper.getDate(7));

        hashArray.forEach(function(element) {
          getTotalHoursSheetData(element, function(error, dataRes) {
            emailService.sendTimeSheet(dataRes, function(error, mailRes) {
              if (error) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
              if (mailRes) {
                console.log(mailRes);
              }
            });
          });
        });
        response.successResponse(req, res, 'end send mail.');
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

// private
// function getTotalHours(reqData, callback) {
//   timesheetService.getWeeklyData(reqData, function(err, timesheetRes) {
//     if (err) return callback(null);
//     if (timesheetRes) {
//       var totalMin = 0;
//       timesheetRes.forEach(function(sheet) {
//         var a = sheet.dayTotal.split(':');
//         totalMin = totalMin + (a[0]*60 + a[1]*1);
//       });
//       var totalHours = helper.convertMinToHour(totalMin);
//       callback(totalHours);
//     } else {
//       // no timesheet found
//       console.log('no timesheet found');
//       return callback(null);
//     }
//   });
// }

function getTotalHoursSheetData(reqData, callback) {
  timesheetService.getTimesheetByDate(reqData, function(err, timesheetRes, reqData) {
    if (err) return callback(null);
    if (timesheetRes) {
      var totalMin = 0;
      timesheetRes.forEach(function(sheet) {
        var a = sheet.dayTotal.split(':');
        totalMin = totalMin + (a[0]*60 + a[1]*1);
      });
      reqData['timeSheetData'] = helper.prepareTimesheetData(timesheetRes);
      reqData['totalHours'] = helper.convertMinToHour(totalMin);
      return callback(null, reqData);
    } else {
      // no timesheet found
      console.log('no timesheet found');
      return callback(null, null);
    }
  });
}

function getSheetDataArray(empList, fileName, startDate, endDate) {
  var reqHashArray = [];
  empList.forEach(function(emp) {
    var hash = {
      emailId: 'rahul@newput.com',
      fileName: fileName,
      empName: emp.fullName,
      month: helper.getCurrentMonthName(),
      year: helper.getCurrentYear(),
      timeSheetData: [],
      hourSheetData: [],
      totalHours: '00:00',
      userId: emp.id,
      startDate: startDate,
      endDate: endDate,
      formattedStartDate: startDate,
      formattedEndDate: endDate
    };
    var updatedHash = helper.prepareFormattedStartEndDate(hash);
    reqHashArray.push(updatedHash);
  });

  return reqHashArray;
}

function getHourData(fileName, startDate, endDate) {
  var hash = {
    emailId: 'rahul@newput.com',
    fileName: fileName,
    empName: '',
    month: helper.getCurrentMonthName(),
    year: helper.getCurrentYear(),
    timeSheetData: [],
    hourSheetData: [],
    totalHours: '00:00',
    userId: '',
    startDate: startDate,
    endDate: endDate,
    formattedStartDate: startDate,
    formattedEndDate: endDate
  };
  var updatedHash = helper.prepareFormattedStartEndDate(hash);

  return updatedHash;
}

module.exports = api;
