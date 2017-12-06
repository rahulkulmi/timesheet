// 'use strict';
// var Device = require('../models/device');
// var User = require('../models/user');
// var UserDevice = require('../models/user_device');
// var Session = require('../models/session');
// var appException = require('../app_util/exceptions');
// var msg = require('../app_util/messages');
// var helper = require('../app_util/helpers');
// var response = require('../services/api_response');
// var async = require('async');
// var log = require('../app_util/logger');
//
// module.exports.validateDeviceId = function(req, res, next) {
//   try {
//     req.checkHeaders('device_id', msg.invalidDeviceId).notEmpty().isAlpha();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.BAD_REQUEST(msg.validationError + ' : ' + errors[0].msg));
//     }
//
//     Device.findOne({ device_id: req.headers.device_id }, function(err, deviceRes) {
//       if (err) {
//         return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//       } else if (deviceRes === undefined || deviceRes === null) {
//         if (req.headers.device_id === 'LTDEFAULT') {
//           return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-102, msg.authDefaultDeviceId));
//         } else {
//           return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-103, msg.authInvalidDeviceId));
//         }
//       } else {
//         req.session.device_id = req.headers.device_id;
//         return next();
//       }
//     });
//   } catch (err) {
//     log.error('validateDeviceId exception : ' + err.stack);
//     return next();
//   }
// };
//
// module.exports.validateDeviceToken = function(req, res, next) {
//   try {
//     req.checkHeaders('device_token', msg.authTokenNotFound).notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.BAD_REQUEST(msg.validationError + ' : ' + errors[0].msg));
//     }
//
//     req.session.token = req.headers.device_token;
//     Session.findOne({ token: req.headers.device_token }, function(err, sessionRes) {
//       if (err) {
//         return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//       } else if (sessionRes === undefined || sessionRes === null) {
//         return response.errorResponse(req, res, appException.BAD_REQUEST(msg.authInvalidToken));
//       } else {
//         req.session.session = sessionRes;
//         helper.genUpdatedDate(function(helperRes) {
//           var query = { _id: sessionRes.device_id, user_id: sessionRes.user_id };
//           var options = { new: true };
//           var userJson = { $set: { 'timestamps.last_used': helperRes } };
//           UserDevice.findOneAndUpdate(query, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a UserDevice id was found
//             var feed_ids = [];
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.RECORD_NOT_FOUND(msg.authNotVerified));
//             } else if (userRes.settings.feeds === undefined || userRes.settings.feeds === null || userRes.settings.feeds.length === 0) {
//               req.session.feed_ids = feed_ids;
//               return next();
//             } else {
//               for (var k = 0; k < userRes.settings.feeds.length; k++) {
//                 feed_ids.push(userRes.settings.feeds[k].feed_id);
//               }
//               req.session.feed_ids = feed_ids;
//               return next();
//             }
//           });
//         });
//       }
//     });
//   } catch (err) {
//     log.error('validateDeviceToken exception : ' + err.stack);
//     return next();
//   }
// };
//
// module.exports.validateDeviceTokenDefault = function(req, res, next) {
//   try {
//     req.checkHeaders('device_token', msg.authTokenNotFound).notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.BAD_REQUEST(msg.validationError + ' : ' + errors[0].msg));
//     }
//
//     req.session.token = req.headers.device_token;
//     Session.findOne({ token: req.headers.device_token }, function(err, sessionRes) {
//       if (err) {
//         return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//       } else if (sessionRes === undefined || sessionRes === null) {
//         return response.errorResponse(req, res, appException.BAD_REQUEST(msg.authInvalidToken));
//       } else {
//         req.session.session = sessionRes;
//         helper.genUpdatedDate(function(helperRes) {
//           var query = { _id: sessionRes.device_id, user_id: sessionRes.user_id };
//           var options = { new: true };
//           var userJson = { $set: { 'timestamps.last_used': helperRes } };
//           UserDevice.findOneAndUpdate(query, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a UserDevice id was found
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.RECORD_NOT_FOUND(msg.authNotVerified));
//             } else if (userRes.settings.feeds === undefined || userRes.settings.feeds === null || userRes.settings.feeds.length === 0) {
//               helper.getDefaultFeed(function(err, helperRes) {
//                 if (err) {
//                   return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//                 } else {
//                   req.session.feed_ids = helperRes;
//                   return next();
//                 }
//               });
//             } else {
//               var feed_ids = [];
//               for (var k = 0; k < userRes.settings.feeds.length; k++) {
//                 feed_ids.push(userRes.settings.feeds[k].feed_id);
//               }
//               req.session.feed_ids = feed_ids;
//               return next();
//             }
//           });
//         });
//       }
//     });
//   } catch (err) {
//     log.error('validateDeviceTokenDefault exception : ' + err.stack);
//     return next();
//   }
// };
//
// module.exports.validateDeviceIdDeviceToken = function(req, res, next) {
//   try {
//     req.checkHeaders('device_id', msg.invalidDeviceId).notEmpty().isAlpha();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-101, msg.invalidDeviceId));
//     }
//
//     req.session.device_id = req.headers.device_id;
//     var deviceId = req.headers.device_id;
//     var userToken = req.headers.device_token;
//     var options = { new: true };
//     var updatedTime = null;
//     if (userToken === undefined || userToken === null) {
//       // Define variable here, so all tasks can access the variable
//       var deviceObj;
//       var userObj;
//       // var updatedTime
//
//       async.series([
//         // Get Updated Date and Time for time stamps.
//         function(callback) {
//           helper.genUpdatedDate(function(helperRes) {
//             updatedTime = helperRes;
//             return callback();
//           });
//         },
//         // Load Device
//         function(callback) {
//           Device.findOne({ device_id: deviceId }, function(err, deviceRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a device id was found
//             if (deviceRes === undefined || deviceRes === null) {
//               if (req.headers.device_id === 'LTDEFAULT') {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-102, msg.authDefaultDeviceId));
//               } else {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-103, msg.authInvalidDeviceId));
//               }
//             } else {
//               if (deviceRes.user_id === undefined || deviceRes.user_id === null) {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//               } else {
//                 deviceObj = deviceRes;
//                 return callback();
//               }
//             }
//           });
//         },
//         // Load User (won't be called before task 1's "task callback" has been called)
//         function(callback) {
//           var userJson = { $set: { 'timestamps.last_used': updatedTime,
//             'timestamps.updated': updatedTime } };
//           User.findByIdAndUpdate(deviceObj.user_id, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a user was found
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else if (userRes.phone_verified === undefined || userRes.phone_verified === null || userRes.phone_verified === false) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else {
//               userObj = userRes;
//               return callback();
//             }
//           });
//         },
//         // Load Session (won't be called before task 2's "task callback" has been called)
//         function(callback) {
//           Session.findOne({ user_id: userObj._id, device_id: deviceId }, function(err, sessionRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a session was found
//             if (sessionRes === undefined || sessionRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else {
//               if (sessionRes.token === undefined || sessionRes.token === null) {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//               } else {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-105, msg.authTokenNotFound));
//               }
//             }
//           });
//         }
//       ], function(err) { // This function gets called after the all tasks have called their "task callbacks"
//         if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//         // Here we reset locals variable to null
//         deviceObj = null;
//         userObj = null;
//         updatedTime = null;
//         deviceId = null;
//         userToken = null;
//         options = null;
//       });
//     } else {
//       // Define variable here, so all tasks can access the variable
//       var sessionObj;
//       // var updatedTime
//
//       async.series([
//         // Get Updated Date and Time for time stamps.
//         function(callback) {
//           helper.genUpdatedDate(function(helperRes) {
//             updatedTime = helperRes;
//             return callback();
//           });
//         },
//         // Load Session
//         function(callback) {
//           Session.findOne({ token: userToken, device_id: deviceId }, function(err, sessionRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a session was found
//             if (sessionRes === undefined || sessionRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-106, msg.authDeviceIdTokenNotMatch));
//             } else {
//               req.session.session = sessionRes;
//               if (sessionRes.expires_at > new Date()) {
//                 sessionObj = sessionRes;
//                 return callback();
//               } else {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-107, msg.authTokenExpired));
//               }
//             }
//           });
//         },
//         // Load User (won't be called before task 1's "task callback" has been called)
//         function(callback) {
//           var userJson = { $set: { 'timestamps.last_used': updatedTime } };
//           User.findByIdAndUpdate(sessionObj.user_id, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a user was found
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else {
//               return callback();
//             }
//           });
//         },
//         // Load UserDevice (won't be called before task 2's "task callback" has been called)
//         function(callback) {
//           var query = { _id: sessionObj.device_id, user_id: sessionObj.user_id };
//           var userJson = { $set: { 'timestamps.last_used': updatedTime,
//             'timestamps.updated': updatedTime } };
//           UserDevice.findOneAndUpdate(query, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a user was found
//             var feed_ids = [];
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else if (userRes.settings.feeds === undefined || userRes.settings.feeds === null || userRes.settings.feeds.length === 0) {
//               req.session.feed_ids = feed_ids;
//               feed_ids = null;
//               return next();
//             } else {
//               for (var k = 0; k < userRes.settings.feeds.length; k++) {
//                 feed_ids.push(userRes.settings.feeds[k].feed_id);
//               }
//               req.session.feed_ids = feed_ids;
//               feed_ids = null;
//               return next();
//             }
//           });
//         }
//       ], function(err) { // This function gets called after the all tasks have called their "task callbacks"
//         if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//         // Here we reset locals variable to null
//         sessionObj = null;
//         updatedTime = null;
//         deviceId = null;
//         userToken = null;
//         options = null;
//       });
//     }
//   } catch (err) {
//     log.error('validateDeviceIdDeviceToken exception : ' + err.stack);
//     return next();
//   }
// };
//
// module.exports.validateDeviceIdDeviceTokenNotTime = function(req, res, next) {
//   try {
//     req.checkHeaders('device_id', msg.invalidDeviceId).notEmpty().isAlpha();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-101, msg.invalidDeviceId));
//     }
//
//     req.session.device_id = req.headers.device_id;
//     var deviceId = req.headers.device_id;
//     var userToken = req.headers.device_token;
//     var options = { new: true };
//     var updatedTime = null;
//     if (userToken === undefined || userToken === null) {
//       // Define variable here, so all tasks can access the variable
//       var deviceObj;
//       var userObj;
//       // var updatedTime
//
//       async.series([
//         // Get Updated Date and Time for time stamps.
//         function(callback) {
//           helper.genUpdatedDate(function(helperRes) {
//             updatedTime = helperRes;
//             return callback();
//           });
//         },
//         // Load Device
//         function(callback) {
//           Device.findOne({ device_id: deviceId }, function(err, deviceRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a device id was found
//             if (deviceRes === undefined || deviceRes === null) {
//               if (req.headers.device_id === 'LTDEFAULT') {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-102, msg.authDefaultDeviceId));
//               } else {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-103, msg.authInvalidDeviceId));
//               }
//             } else {
//               if (deviceRes.user_id === undefined || deviceRes.user_id === null) {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//               } else {
//                 deviceObj = deviceRes;
//                 return callback();
//               }
//             }
//           });
//         },
//         // Load User (won't be called before task 1's "task callback" has been called)
//         function(callback) {
//           var userJson = { $set: { 'timestamps.last_used': updatedTime } };
//           User.findByIdAndUpdate(deviceObj.user_id, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a user was found
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else if (userRes.phone_verified === undefined || userRes.phone_verified === null || userRes.phone_verified === false) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else {
//               userObj = userRes;
//               return callback();
//             }
//           });
//         },
//         // Load Session (won't be called before task 2's "task callback" has been called)
//         function(callback) {
//           Session.findOne({ user_id: userObj._id, device_id: deviceId }, function(err, sessionRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a session was found
//             if (sessionRes === undefined || sessionRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else {
//               if (sessionRes.token === undefined || sessionRes.token === null) {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//               } else {
//                 return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-105, msg.authTokenNotFound));
//               }
//             }
//           });
//         }
//       ], function(err) { // This function gets called after the all tasks have called their "task callbacks"
//         if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//         // Here we reset locals variable to null
//         deviceObj = null;
//         userObj = null;
//         updatedTime = null;
//         deviceId = null;
//         userToken = null;
//         options = null;
//       });
//     } else {
//       // Define variable here, so all tasks can access the variable
//       var sessionObj;
//       // var updatedTime
//
//       async.series([
//         // Get Updated Date and Time for time stamps.
//         function(callback) {
//           helper.genUpdatedDate(function(helperRes) {
//             updatedTime = helperRes;
//             return callback();
//           });
//         },
//         // Load Session
//         function(callback) {
//           Session.findOne({ token: userToken, device_id: deviceId }, function(err, sessionRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a session was found
//             if (sessionRes === undefined || sessionRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-106, msg.authDeviceIdTokenNotMatch));
//             } else {
//               req.session.session = sessionRes;
//               sessionObj = sessionRes;
//               return callback();
//             }
//           });
//         },
//         // Load User (won't be called before task 1's "task callback" has been called)
//         function(callback) {
//           var userJson = { $set: { 'timestamps.last_used': updatedTime } };
//           User.findByIdAndUpdate(sessionObj.user_id, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a user was found
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else {
//               return callback();
//             }
//           });
//         },
//         // Load UserDevice (won't be called before task 2's "task callback" has been called)
//         function(callback) {
//           var query = { _id: sessionObj.device_id, user_id: sessionObj.user_id };
//           var userJson = { $set: { 'timestamps.last_used': updatedTime } };
//           UserDevice.findOneAndUpdate(query, userJson, options, function(err, userRes) {
//             if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//             // Check that a user was found
//             var feed_ids = [];
//             if (userRes === undefined || userRes === null) {
//               return response.errorResponse(req, res, appException.VALIDATION_EXCEPTION(-104, msg.authNotVerified));
//             } else if (userRes.settings.feeds === undefined || userRes.settings.feeds === null || userRes.settings.feeds.length === 0) {
//               req.session.feed_ids = feed_ids;
//               feed_ids = null;
//               return next();
//             } else {
//               for (var k = 0; k < userRes.settings.feeds.length; k++) {
//                 feed_ids.push(userRes.settings.feeds[k].feed_id);
//               }
//               req.session.feed_ids = feed_ids;
//               feed_ids = null;
//               return next();
//             }
//           });
//         }
//       ], function(err) { // This function gets called after the all tasks have called their "task callbacks"
//         if (err) return response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//         // Here we reset locals variable to null
//         sessionObj = null;
//         updatedTime = null;
//         deviceId = null;
//         userToken = null;
//         options = null;
//       });
//     }
//   } catch (err) {
//     log.error('validateDeviceIdDeviceTokenNotTime exception : ' + err.stack);
//     return next();
//   }
// };
