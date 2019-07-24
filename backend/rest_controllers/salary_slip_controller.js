'use strict';
var response = require('../services/api_response');
var appException = require('../app_util/exceptions');
var salaryService = require('../services/salary_slip_service');

// public
var api = {};

api['uploadSingleFile'] = function(req, res) {
  try {
    salaryService.uploadSingle(req,res,function(err, resp){
        if(err){
            response.errorResponse(req, res, appException.INVALID_FILE_ERROR(err), err.stack);
        } else {
          response.successResponse(req, res, resp);
        }
    })
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;