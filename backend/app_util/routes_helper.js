'use strict';
// var Device = require('../models/device');
// var User = require('../models/user');
// var UserDevice = require('../models/user_device');
// var Session = require('../models/session');
var appException = require('./exceptions');
// var helper = require('../app_util/helpers');
var response = require('../services/api_response');
var config = require('./config');
var log = require('./logger');
var jwt = require('jsonwebtoken');

// public
var utility = {};

utility['validateToken'] = function(req, res, next) {
  try {
    req.checkHeaders('token', 'Auth token not found').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      return response.errorResponse(req, res, appException.BAD_REQUEST('There have been validation errors' + ' : ' + errors[0].msg));
    }

    jwt.verify(req.headers.token, config.JWT_SECRET_KEY, function(err, jwtRes) {
      // err
      if (err) {
        console.log(err);
        return response.errorResponse(req, res, appException.VERIFICATION_EXCEPTION(), err.message);
      }
      // jwtRes
      req.session.user_id = jwtRes.user_id;
      return next();
    });
  } catch (err) {
    log.error('validateToken exception : ' + err.stack);
    return next();
  }
};

utility['validateAdminToken'] = function(req, res, next) {
  try {
    req.checkHeaders('token', 'Auth token not found').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      return response.errorResponse(req, res, appException.BAD_REQUEST('There have been validation errors' + ' : ' + errors[0].msg));
    }

    jwt.verify(req.headers.token, config.JWT_SECRET_KEY, function(err, jwtRes) {
      // err
      if (err) {
        console.log(err);
        return response.errorResponse(req, res, appException.VERIFICATION_EXCEPTION(), err.message);
      }
      // jwtRes
      if (jwtRes.status == 'employee') {
        return response.errorResponse(req, res, appException.NOT_AUTHORIZED());
      }
      req.session.user_id = jwtRes.user_id;
      req.session.status = jwtRes.status;
      return next();
    });
  } catch (err) {
    log.error('validateToken exception : ' + err.stack);
    return next();
  }
};

module.exports = utility;
