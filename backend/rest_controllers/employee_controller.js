'use strict';
var response = require('../services/api_response');
var employeeService = require('../services/employee_service');
var appException = require('../app_util/exceptions');

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

// api for getting list of all employees
api['getAllEmployeeList'] = function(req, res) {
  try {
    employeeService.getAllEmployeeList(function(err, empRes) {
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

//api for getting employee detail when admin logged in
api['getEmployeeDetailById'] = function(req, res) {
  try {
    var reqData = req.params
    if (req.session.status == 'admin' && reqData.id) {
      reqData['userId'] = reqData.id;
    } else {
      reqData['userId'] = req.session.user_id;
    }
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

module.exports = api;
