'use strict';
var request = require('request');
var bcrypt = require('bcrypt');

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
  var resData = null;
  var user_hash = {
    id: userData.id,
    teamId: userData.teamId,
    channelId: userData.channelId,
    firstName: userData.first_name,
    lastName: userData.last_name,
    fullName: userData.real_name,
    email: userData.email,
    password: 'newput123',
    profileImgSmall: userData.image_48,
    profileImg: userData.image_192
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
  controller.storage.employee.all(function(error, data) {
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
