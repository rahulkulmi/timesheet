'use strict';
var response = require('../services/api_response');
var timesheetService = require('../services/timesheet_service');
var employeeService = require('../services/employee_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');


// public
var api = {};

api['getMonthlyTimeSheet'] = function(req, res) {
  try {
    // var reqData = req.body;
    var reqData = helper.prepareMonthlyStartEndDate(req.query);
    reqData['userId'] = req.session.user_id;
    if (req.session.status == 'admin' && reqData.user_id) {
      reqData['userId'] = reqData.user_id;
    }
    var updatedHash = helper.prepareFormattedStartEndDate(reqData);
    var resDate = {
      timesheetData: [],
      totalHours: '00:00'
    }
    timesheetService.getTimesheetByDate(updatedHash, function(err, timesheetRes) {
      if (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      } else {
        resDate['timesheetData'] = helper.prepareTimesheetData(timesheetRes);
        // resDate['timesheetData'] = timesheetRes;
        resDate['totalHours'] = helper.calculateTotalHours(timesheetRes);
        response.successResponse(req, res, resDate);
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['getMonthlyHourSheet'] = function(req, res) {
  try {
    var reqData = helper.prepareMonthlyStartEndDate(req.query);
    reqData['fileName'] = 'hoursheet';
    employeeService.getEmployeeList(function(err, empRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
      if (empRes) {
        var graphData = helper.getHoursheetData(reqData);
        var recordArray = [];
        var count = 1;
        empRes.forEach(function(element) {
          graphData['userId'] = element.id;
          var recordHash = {
            empName: element.fullName,
            totalHours: '00:00'
          };
          // calculate total hours
          timesheetService.getTotalHoursByDate(graphData, function(error, dataRes) {
            if (dataRes) {
              recordHash['totalHours'] = dataRes;
            }
            recordArray.push(recordHash);
            if (empRes.length == count) {
              response.successResponse(req, res, recordArray);
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

module.exports = api;
