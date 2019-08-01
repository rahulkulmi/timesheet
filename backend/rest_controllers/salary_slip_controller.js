'use strict';
var response = require('../services/api_response');
var appException = require('../app_util/exceptions');
var salaryService = require('../services/salary_slip_service');
var Employee = require('../models/employee');

// public
var api = {};

api['uploadSingleFile'] = function(req, res) {
  try {
    salaryService.uploadSingle(req,res,function(err, resp){
        if(err){
            response.errorResponse(req, res, err, err.stack);
        } else {
          response.successResponse(req, res, resp);
        }
    })
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['getEmployeeSalarySlips'] = function(req, res) {
  var reqData = req.query
  try {
      salaryService.getEmployeeSalarySlips(reqData,function(err, resp){
          if(err){
              response.errorResponse(req, res, appException.RECORD_NOT_FOUND(), err.stack);
          } else {
            response.successResponse(req, res, resp);
          }
      });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;