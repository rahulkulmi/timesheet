'use strict';
var nodemailer = require('nodemailer');
var mailerhbs = require('nodemailer-express-handlebars');
var path = require("path");
var handlebars = require('handlebars');
var fs = require('fs');
var log = require('../app_util/logger');

// private

function readHTMLFile(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, html);
    }
  });
};

function sendMailTransporter(mailOptions, callback) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhamkatariya126@gmail.com',
      pass: 'newput1234'
    }
  });

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      log.error(error);
      return callback(error);
    } else {
      console.log('Email sent: ' + info.response);
      log.info('Email sent: ' + info.response);
      return callback(null, info);
    }
  });
}

handlebars.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});


// public
var service = {};

service['sendHourSheet'] = function(reqData, callback) {
  var filePath = path.join(__dirname, '..', 'template/') + reqData.fileName;

  readHTMLFile(filePath, function(err, html) {
    if (err) return callback(err);
    var template = handlebars.compile(html);

    var htmlToSend = template({
      empData: reqData.hourSheetData,
      startDate: reqData.startDate,
      endDate: reqData.endDate
    });

    var mailOptions = {
      from: 'shubhamkatariya126@gmail.com',
      to: reqData.emailId,
      subject: 'Employee Hours',
      html: htmlToSend
    };

    sendMailTransporter(mailOptions, callback);
  });
}

service['sendTimeSheet'] = function(reqData, callback) {
  var filePath = path.join(__dirname, '..', 'template/') + reqData.fileName;

  readHTMLFile(filePath, function(err, html) {
    if (err) return callback(err);
    var template = handlebars.compile(html);

    var htmlToSend = template({
      sheetData: reqData.timeSheetData,
      empName: reqData.empName,
      month: reqData.month,
      year: reqData.year,
      totalHours: reqData.totalHours
    });

    var mailOptions = {
      from: 'shubhamkatariya126@gmail.com',
      to: reqData.emailId,
      subject: 'Employee Timesheet',
      html: htmlToSend
    };

    sendMailTransporter(mailOptions, callback);
  });
}

module.exports = service;
