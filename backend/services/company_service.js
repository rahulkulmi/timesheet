'use strict';
var Company = require('../models/company');

var service = {};

service['getDetail'] = function(callback) {
  try {
    Company.findOne(function(err, companyData) {
      if (err) return callback(err);
      if (companyData) {
        return callback(null, companyData);
      } else {
        return callback();
      }
    });
  } catch (err) {
    return callback(err);
  }
};

service['addCompany'] = function(reqData, callback) {
    try {
        var company = new Company({companyName: reqData.companyName, companyAdd: reqData.address, cinNumber: reqData.cinNumber, companySeal: reqData.companySeal, directorSign: reqData.sign, gstin: reqData.gstin})
        company.save(function(err, companyData) {
            if (err) return callback(err);
            if (companyData) {
              return callback(null, companyData);
            } else {
              return callback();
            }
        });
    } catch (err) {
      return callback(err);
    }
};
service['updateCompany'] = function(req, callback) {
    try {
        Company.findOneAndUpdate({'cinNumber': req.query.cinNumber}, req.reqBody, {upsert:true}, function(err, companyData) {
            if (err) return callback(err);
            if (companyData) {
                return callback(null, companyData);
            } else {
                return callback();
            }
        });
    } catch (err) {
      return callback(err);
    }
  };

  

module.exports = service;