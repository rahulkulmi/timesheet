'use strict';
var winston = require('winston');
var fs = require('fs');
var path = require('path');
var logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
winston.emitErrs = true;

var log = new winston.Logger({
  transports: [ new winston.transports.File({
    level: 'info',
    filename: path.join(logDirectory, 'access.log'),
    handleExceptions: true,
    json: false,
    maxsize: 52428800, //50MB
    maxFiles: 5,
    colorize: false
  }), new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }) ],
  exitOnError: false
});

module.exports = log;
module.exports.stream = {
  write: function(message, encoding) {
    log.info(message);
  }
};
