var appException = require('../app_util/exceptions');
var companyService = require('../services/company_service');
var response = require('../services/api_response');

var api = {};

api['getDetail'] = function(req, res) {
    try {
        companyService.getDetail(function(err, data) {
          if (err) {
              response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
          } else {
            response.successResponse(req, res, data);
          }
        });
      } catch (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      }
};

api['addCompanyInfo'] = function(req, res) {
    try {
        var reqData = req.body;
        companyService.addCompany(reqData, function(err, data) {
          if (err) {
              response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
          } else {
            response.successResponse(req, res, data);
          }
        });
      } catch (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      }
};

api['updateCompanyInfo'] = function(req, res) {
    try {
        var reqData = {query: req.query, reqBody: req.body};
        companyService.updateCompany(reqData, function(err, data) {
          if (err) {
              response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err);
          } else {
            response.successResponse(req, res, data);
          }
        });
      } catch (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      }
};
module.exports = api;