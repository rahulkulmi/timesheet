'use strict';
var request = require('request');
var bcrypt = require('bcrypt');
var helper = require('../app_util/helper');

// public
var api = {};

api['getDetailById'] = function(controller, userId, cb) {
  var resData = null;
  controller.storage.employee.get(userId, function(error, data) {
    if (error) {
      console.log('Error inside employee getDetailById()');
      console.log(error);
    }
    if (data) {
      resData = data;
    }
    cb(resData);
  });
};

api['saveEmployeeDetail'] = function(controller, userData, cb) {
  var bot = controller.spawn();
  var emailIds = bot.botkit.config.adminEmailIds.split(',');
  var resData = null;
  var user_hash = {
    id: userData.id,
    teamId: userData.teamId,
    channelId: userData.channelId,
    firstName: helper.getCapitalizeName(userData.first_name),
    lastName: helper.getCapitalizeName(userData.last_name),
    fullName: helper.getCapitalizeName(userData.real_name),
    email: userData.email,
    password: 'newput123',
    profileImgSmall: userData.image_48,
    profileImg: userData.image_192,
    notificationStatus: false,
    status: 'employee'
  }
  if (emailIds.includes(userData.email)) {
    user_hash['status'] = 'admin';
  }
  user_hash['password'] = bcrypt.hashSync(user_hash.password, 10);
  controller.storage.employee.save(user_hash, function(error, data) {
    if (error) {
      console.log('Error inside employee saveEmployeeDetail()');
      console.log(error);
    }
    if (data) {
      resData = data;
    }
    cb(resData);
  });
};

api['getEmployeeList'] = function(controller, cb) {
  var resData = null;
  controller.storage.employee.find({status: 'employee'}, function(error, data) {
    if (error) {
      console.log('Error inside employee getEmployeeList()');
      console.log(error);
    }
    if (data) {
      resData = data;
    }
    cb(resData);
  });
};

module.exports = api;
