'use strict';
var appMessages = require('./app_messages');

// public
var api = {};

api['getTimesheetDialog'] = function(bot, resData, callbackId, date) {
  if (resData) {
    var status = resData.status;
    var officeIn = resData.officeIn;
    var officeOut = resData.officeOut;
    var homeIn = resData.homeIn;
    var homeOut = resData.homeOut;
  } else {
    var status = null;
    var officeIn = null;
    var officeOut = null;
    var homeIn = null;
    var homeOut = null;
  }

  var dialog = bot.createDialog(
    'Date: ' + date,
    callbackId,
    'Submit'
  ).addText(appMessages.dialogTextStatus, 'status', status, {placeholder: appMessages.dialogTextStatusPh})
  .addText(appMessages.dialogTextOfficeIn, 'officeIn', officeIn, {optional: true, placeholder: appMessages.dialogTextOfficeInPh})
  .addText(appMessages.dialogTextOfficeOut, 'officeOut', officeOut, {optional: true, placeholder: appMessages.dialogTextOfficeOutPh})
  .addText(appMessages.dialogTextHomeIn, 'homeIn', homeIn, {optional: true, placeholder: appMessages.dialogTextHomeInPh})
  .addText(appMessages.dialogTextHomeOut, 'homeOut', homeOut, {optional: true, placeholder: appMessages.dialogTextHomeOutPh});

  return dialog;
};

api['getRegistrationDialog'] = function(bot, resData, callbackId) {
  if (resData) {
    var empName = resData.empName;
    var empGender = resData.empGender;
    var empEmail = resData.empEmail;
    var empPwd = resData.empPwd;
  } else {
    var empName = null;
    var empGender = null;
    var empEmail = null;
    var empPwd = null;
  }

  var dialog = bot.createDialog(
    appMessages.dialogRegTitle,
    callbackId,
    'Submit'
  ).addText(appMessages.dialogRegTextName, 'empName', empName, {placeholder: appMessages.dialogRegTextNamePh})
  .addSelect(appMessages.dialogRegTextGender, 'empGender', empGender, [
    {label:appMessages.dialogRegSelectGenderMail,
      value:appMessages.dialogRegSelectGenderMail},
    {label:appMessages.dialogRegSelectGenderFemale,
      value:appMessages.dialogRegSelectGenderFemale}
  ], {placeholder: appMessages.dialogRegTextGenderPh})
  .addEmail(appMessages.dialogRegTextEmail, 'empEmail', empEmail, {placeholder: appMessages.dialogRegTextEmailPh})
  .addText(appMessages.dialogRegTextPwd, 'empPwd', empPwd, {placeholder: appMessages.dialogRegTextPwdPh});

  return dialog;
};

module.exports = api;
