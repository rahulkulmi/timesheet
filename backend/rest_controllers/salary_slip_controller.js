'use strict';
var response = require('../services/api_response');
var appException = require('../app_util/exceptions');
var salaryService = require('../services/salary_slip_service');
var Employee = require('../models/employee');

// public
var api = {};

api['uploadSingleFile'] = function(req, res) {
  try {
    salaryService.uploadSingle(req,res,function(err, data){
        if(err){
            response.errorResponse(req, res, err, err.stack);
        } else {
          response.successResponse(req, res, data);
        }
    })
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['getEmployeeSalarySlips'] = function(req, res) {
  var reqData = req.query
  if (req.session.status == 'admin' && reqData.empID) {
    reqData['empID'] = reqData.empID;
  } else {
    reqData['empID'] = req.session.user_id;
  }
  if(!reqData.year) {
    reqData['year'] = new Date().getFullYear();
  }
  try {
      salaryService.getEmployeeSalarySlips(reqData,function(err, data){
          if(err){
              response.errorResponse(req, res, appException.RECORD_NOT_FOUND(), err.stack);
          } else {
            response.successResponse(req, res, data);
          }
      });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};
api['sendMail'] = function(req, res) {
  var reqData = req.body
  try {
    salaryService.generatePDfSendEmail(reqData,function(err, data){
        if(err){
            response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
        } else {
          response.successResponse(req, res, data);
        }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

api['removeSalarySlip'] = function(req, res) {
  var reqData = req.query
  try {
    salaryService.removeSalarySlip(reqData,function(err, data){
        if(err){
            response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
        } else {
          response.successResponse(req, res, data);
        }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;