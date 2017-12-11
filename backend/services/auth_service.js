'use strict';
var Employee = require('../models/employee');
// var UserDevice = require('../models/user_device');
// var Device = require('../models/device');
// var helper = require('../app_util/helpers');
var config = require('../app_util/config');
// var userService = require('../services/user_service');
// var crypto = require('crypto');
// var async = require('async');
var jwt = require('jsonwebtoken');

// public
var service = {};

service['userLogin'] = function(reqData, callback) {
  try {
    Employee.findOne({ email: reqData.email }, function(err, empRes) {
      if (err) return callback(err);
      if (empRes) {
        if (!empRes.comparePassword(reqData.password)) {
          return callback(null, 'Authentication failed. Wrong password.');
        } else {
          var tokan = jwt.sign({ email: empRes.email, fullName: empRes.fullName, user_id: empRes.id}, config.JWT_SECRET_KEY, { expiresIn: '1h' });
          return callback(null, tokan);
        }
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;
