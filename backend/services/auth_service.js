'use strict';
var Employee = require('../models/employee');
// var helper = require('../app_util/helpers');
var config = require('../app_util/config');
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
          var tokan = jwt.sign({ user_id: empRes.id, status: empRes.status}, config.JWT_SECRET_KEY, { expiresIn: '1h' });
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
