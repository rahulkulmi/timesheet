'use strict';
var response = require('../services/api_response');
var authService = require('../services/auth_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');

// public
var api = {};

api['userLogin'] = function(req, res) {
  try {
    var reqData = req.body;
    authService.userLogin(reqData, function(err, authRes) {
      if (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      } else {
        response.successResponse(req, res, authRes);
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;
