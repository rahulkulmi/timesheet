'use strict';
var request = require('request');

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
    firstName: userData.first_name,
    lastName: userData.last_name,
    fullName: userData.real_name,
    email: userData.email,
    password: 'newput123',
    profileImgSmall: userData.image_48,
    profileImg: userData.image_192
  }
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

module.exports = api;
