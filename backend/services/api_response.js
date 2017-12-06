'use strict';
var log = require('../app_util/logger');

module.exports.successResponse = function(req, res, data, customMsg) {
  res.setHeader('Content-type', 'application/json; charset=utf-8');
  var result = { 'success': true, 'data': data, 'error': null, 'rcode': null,
    'customMsg': customMsg, 'processingTimeMillis': (new Date().getTime() - global.start) };

  if (global.timeout) {
    clearTimeout(global.timeout);
    global.timeout = null;
    global.start = null;
  }
  res.status(200).send(result);
};

module.exports.errorResponse = function(req, res, appError, coreException) {
  res.setHeader('Content-type', 'application/json; charset=utf-8');
  var result = { 'success': false, 'data': null, 'error': appError.message,
    'rcode': appError.rcode, 'customMsg': appError.customMsg,
    'processingTimeMillis': (new Date().getTime() - global.start),
    'coreException': coreException };
  var reqIP = req.connection.remoteAddress;
  var reqHeader = JSON.stringify(res.req.headers);
  var resAPI = JSON.stringify(result);
  log.warn('Request IP : ' + reqIP + ', Request headers : ' + reqHeader + ', API Response : ' + resAPI);

  if (global.timeout) {
    clearTimeout(global.timeout);
    global.timeout = null;
    global.start = null;
  }
  res.status(appError.httpCode).send(result);
};
