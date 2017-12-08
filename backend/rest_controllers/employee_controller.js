'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');

// public
var api = {};

api['getDetailById'] = function(req, res) {
  try {
    var reqData = req.body;
    reqData['userId'] = req.session.user_id;
    employeeService.getDetailById(reqData, function(err, empRes) {
      if (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      } else {
        response.successResponse(req, res, empRes);
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['sendMailToUserId'] = function(req, res) {
  try {
    var reqData = req.body;
    reqData['userId'] = 'U0DDVDL21';
    reqData['emailId'] = 'rahul@newput.com';
    reqData['filePath'] = 'week.html';
    reqData['weekStartDate'] = helper.getDate(1);
    reqData['weekEndDate'] = helper.getDate(7);

    // reqData.session = req.session.session;
    employeeService.sendMailToUserId(reqData, function(err, empRes) {
      if (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      } else {
        response.successResponse(req, res, empRes);
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;
