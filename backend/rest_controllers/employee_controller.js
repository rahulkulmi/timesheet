'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');
var config = require('../app_util/config');
var Employee = require('../models/employee');

// public
var api = {};

api['getAdminList'] = function(req, res) {
  try {
    employeeService.getAdminList(function(err, empRes) {
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

api['getEmployeeList'] = function(req, res) {
  try {
    employeeService.getEmployeeList(function(err, empRes) {
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

api['resetPassword'] = function(req, res) {
  try {
    var reqData = req.body;
    reqData['userId'] = req.session.user_id;
    employeeService.resetPassword(reqData, function(err, empRes) {
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

api['resetNotification'] = function(req, res) {
  try {
    var reqData = req.body;
    reqData['userId'] = req.session.user_id;
    employeeService.resetNotification(reqData, function(err, empRes) {
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

api['getEmployeeDetailById'] = function(req, res) {
  try {
    var reqData = req.body;
    reqData['userId'] = req.params.id;
    Employee.findOne({ id: req.session.user_id }, function(err, feedRes) {
      if (err) response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);;
      if (feedRes && feedRes.status == 'admin') {
          employeeService.getDetailById(reqData, function(err, empRes) {
            if (err) {
              response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
            } else {
              response.successResponse(req, res, empRes);
            }
          });
      } else {
        response.errorResponse(req, res, appException.RECORD_NOT_FOUND(), err.stack);
      }
    });
    
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;
