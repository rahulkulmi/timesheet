'use strict';
var response = require('../services/api_response');
var appException = require('../app_util/exceptions');
// var helper = require('../app_util/helpers');

// public
var api = {};

api['pingServer'] = function(req, res) {
  try {
    response.successResponse(req, res, 'Server is running.');
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;
