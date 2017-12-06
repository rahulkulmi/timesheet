'use strict';
var Employee = require('../models/employee');
var helper = require('../app_util/helpers');
var mailService = require('./email_service');

// public
var service = {};

service['getDetailById'] = function(reqData, callback) {
  try {
    Employee.findOne({ id: reqData.userId }, function(err, feedRes) {
      if (err) return callback(err);
      if (feedRes) {
        return callback(null, feedRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

service['getEmployeeList'] = function(callback) {
  try {
    Employee.find({}, function(err, employeeRes) {
      if (err) return callback(err);
      if (employeeRes) {
        return callback(null, employeeRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

service['sendMailToUserId'] = function(reqData, callback) {
  try {
    mailService.sendWeeklyTimesheet(reqData, callback);
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;
