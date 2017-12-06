// 'use strict';
// var User = require('../models/user');
// var Session = require('../models/session');
// var UserDevice = require('../models/user_device');
// var Device = require('../models/device');
// var helper = require('../app_util/helpers');
// var msg = require('../app_util/messages');
// var log = require('../app_util/logger');
// var userService = require('../services/user_service');
// var crypto = require('crypto');
// var async = require('async');
//
// module.exports = {
//   authRegister: function(reqData, callback) {
//     try {
//       var options = { upsert: true, new: true };
//       var userJson = { phone_country_code: reqData.phone_country_code, phone_number: reqData.phone_number };
//       var sessionJson = { device_id: reqData.device_id };
//       //				userJson.phone_id = reqData.phone_country_code + reqData.phone_number
//       userJson.phone_id = '1' + reqData.phone_number;
//       helper.genUpdatedDate(function(helperRes) {
//         userJson.timestamps = {};
//         userJson.timestamps.updated = helperRes;
//         userJson.timestamps.last_used = helperRes;
//       });
//       helper.genSecurityCode(function(helperRes) {
//         sessionJson.security_code = helperRes;
//       });
//       helper.genExpireCode(function(helperRes) {
//         sessionJson.code_expires_at = helperRes;
//       });
//
//       User.findOneAndUpdate({ phone_number: reqData.phone_number },
//         userJson, function(err, userRes) {
//           if (err) {
//             return callback(err);
//           } else if (userRes === null) {
//             //						log.error('create')
//             helper.genUpdatedDate(function(helperRes) {
//               userJson.timestamps.created = helperRes;
//             });
//             User.create(userJson, function(err, userNewRes) {
//               if (err) {
//                 return callback(err);
//               } else if (userNewRes !== null) {
//                 sessionJson.user_id = userNewRes._id;
//                 Session.findOneAndUpdate({ user_id: userNewRes._id, device_id: reqData.device_id },
//                   sessionJson, options, function(err, sessionRes) {
//                     if (err) {
//                       return callback(err);
//                     } else if (sessionRes !== null) {
//                       Device.findOneAndUpdate({ device_id: sessionRes.device_id },
//                         { user_id: userNewRes._id }, function(err, deviceRes) {
//                           if (err) {
//                             return callback(err);
//                           } else if (deviceRes !== null) {
//                             return callback(null, sessionRes);
//                           } else {
//                             return callback(null, null);
//                           }
//                         });
//                     } else {
//                       return callback(null, null);
//                     }
//                   });
//               } else {
//                 return callback(null, null);
//               }
//             });
//           } else if (userRes !== null) {
//             //						log.error('update')
//             sessionJson.user_id = userRes._id;
//             Session.findOneAndUpdate({ user_id: userRes._id, device_id: reqData.device_id },
//               sessionJson, options, function(err, sessionRes) {
//                 if (err) {
//                   return callback(err);
//                 } else if (sessionRes !== null) {
//                   Device.findOneAndUpdate({ device_id: sessionRes.device_id },
//                     { user_id: userRes._id }, function(err, deviceRes) {
//                       if (err) {
//                         return callback(err);
//                       } else if (deviceRes !== null) {
//                         return callback(null, sessionRes);
//                       } else {
//                         return callback(null, null);
//                       }
//                     });
//                 } else {
//                   return callback(null, null);
//                 }
//               });
//           } else {
//             return callback(null, null);
//           }
//         });
//     } catch (err) {
//       return callback(err);
//     }
//   },
//   authVerify: function(reqData, callback) {
//     try {
//       var md5 = crypto.createHash('md5').update(reqData.phone_number.toString() + Date.now()).digest('hex');
//       var query = { security_code: reqData.security_code,
//         code_expires_at: { $gt: Date.now() } };
//       var sessionJson = { token: md5 };
//       var userJson = { phone_verified: true };
//       var options = { new: true };
//
//       User.findOne({ phone_number: reqData.phone_number }, function(err, userRes) {
//         if (err) {
//           return callback(err);
//         } else if (userRes !== null) {
//           query.user_id = userRes._id;
//           helper.genExpireToken(function(helperRes) {
//             sessionJson.expires_at = helperRes;
//           });
//           Session.findOneAndUpdate(query, sessionJson, options, function(err, SessionRes) {
//             if (err) {
//               return callback(err);
//             } else if (SessionRes !== null) {
//               User.findByIdAndUpdate(userRes._id, userJson, options, function(err, userInfo) {
//                 if (err) {
//                   return callback(err);
//                 } else if (userInfo !== null) {
//                   var userDeviceJson = {};
//                   helper.genUpdatedDate(function(helperRes) {
//                     userDeviceJson = { 'timestamps.updated': helperRes,
//                       'timestamps.activated': helperRes,
//                       'timestamps.last_used': helperRes };
//                   });
//                   userDeviceJson.status = 'activated';
//                   userDeviceJson.user_id = userRes._id;
//                   UserDevice.findByIdAndUpdate(SessionRes.device_id, userDeviceJson, options, function(err, userDeviceRes) {
//                     if (err) {
//                       return callback(err);
//                     } else if (userDeviceRes !== null) {
//                       return callback(null, userInfo);
//                     } else {
//                       return callback(null, null);
//                     }
//                   });
//                 } else {
//                   return callback(null, null);
//                 }
//               });
//             } else {
//               return callback(null, null);
//             }
//           });
//         } else {
//           return callback(null, null);
//         }
//       });
//     } catch (err) {
//       return callback(err);
//     }
//   }
// };
//
// module.exports.twilioActivate = function(reqData, callback) {
//   try {
//     log.warn('Device in : ' + new Date().getTime());
//     Device.findOne({ device_id: reqData.device_id }, function(err, deviceRes) {
//       log.warn('Device out : ' + new Date().getTime());
//       if (err) return callback(err);
//       // Check that a device id was found
//       if (deviceRes === undefined || deviceRes === null) {
//         return callback(null, null);
//       } else {
//         // Define variable here, so all tasks can access the variable
//         var md5 = crypto.createHash('md5').update(reqData.phone_number.toString() + Date.now()).digest('hex');
//         var createOptions = { upsert: true, new: true };
//         var updateOptions = { new: true };
//         var sessionJson = { device_id: reqData.device_id, token: md5 };
//         helper.genExpireToken(function(helperRes) {
//           sessionJson.expires_at = helperRes;
//         });
//         log.warn('userService in : ' + new Date().getTime());
//         userService.updateUserInfo(reqData, function(err, userRes) {
//           log.warn('userService out : ' + new Date().getTime());
//           if (err) return callback(err);
//           // Check that a user was found
//           if (userRes === undefined || userRes === null) {
//             return callback(null, null);
//           } else {
//             var userObj = null;
//             var sessionObj = null;
//             if (deviceRes.user_id === undefined || deviceRes.user_id === null) {
//               log.warn('create user device');
//               // Define variable here, so all tasks can access the variable
//               userObj = userRes;
//
//               async.series([
//                 // Load Session
//                 function(callback) {
//                   var query = { user_id: userObj._id, device_id: reqData.device_id };
//                   sessionJson.user_id = userObj._id;
//                   log.warn('Session 1 in : ' + new Date().getTime());
//                   Session.findOneAndUpdate(query, sessionJson, createOptions, function(err, sessionRes) {
//                     log.warn('Session 1 out : ' + new Date().getTime());
//                     if (err) return callback(err);
//                     // Check that a session was found
//                     if (sessionRes === undefined || sessionRes === null) {
//                       return callback(null, null);
//                     } else {
//                       sessionObj = sessionRes;
//                       return callback();
//                     }
//                   });
//                 },
//                 // Load Device
//                 function(callback) {
//                   var query = { device_id: reqData.device_id };
//                   log.warn('Device 1 in : ' + new Date().getTime());
//                   Device.findOneAndUpdate(query, { user_id: userObj._id }, updateOptions, function(err, deviceRes) {
//                     log.warn('Device 1 out : ' + new Date().getTime());
//                     if (err) return callback(err);
//                     // Check that a device was found
//                     if (deviceRes === undefined || deviceRes === null) {
//                       return callback(null, null);
//                     } else {
//                       return callback();
//                     }
//                   });
//                 },
//                 // Load User Device
//                 function(callback) {
//                   var query = { _id: reqData.device_id };
//                   var userDeviceJson = {};
//                   helper.genUpdatedDate(function(helperRes) {
//                     userDeviceJson = {
//                       'timestamps.created': helperRes,
//                       'timestamps.updated': helperRes,
//                       'timestamps.activated': helperRes,
//                       'timestamps.last_used': helperRes };
//                   });
//                   userDeviceJson.status = 'activated';
//                   userDeviceJson.user_id = userObj._id;
//                   userDeviceJson.settings = userObj.settings;
//                   log.warn('UserDevice 1 in : ' + new Date().getTime());
//                   UserDevice.findOneAndUpdate(query, userDeviceJson, createOptions, function(err, userDeviceRes) {
//                     log.warn('UserDevice 1 out : ' + new Date().getTime());
//                     if (err) return callback(err);
//                     // Check that a user device was found
//                     if (userDeviceRes === undefined || userDeviceRes === null) {
//                       return callback(null, null);
//                     } else {
//                       return callback();
//                     }
//                   });
//                 }
//               ], function(err) { // This function gets called after the all tasks have called their "task callback"
//                 if (err) return callback(err);
//                 // Here sessionObj will be populated with user response
//                 return callback(null, sessionObj);
//               });
//             } else {
//               log.warn('update user device');
//               // Define variable here, so all tasks can access the variable
//               userObj = userRes;
//
//               async.series([
//                 // Load Session
//                 function(callback) {
//                   var query = { user_id: userObj._id, device_id: reqData.device_id };
//                   sessionJson.user_id = userObj._id;
//                   log.warn('Session 2 in : ' + new Date().getTime());
//                   Session.findOneAndUpdate(query, sessionJson, createOptions, function(err, sessionRes) {
//                     log.warn('Session 2 out : ' + new Date().getTime());
//                     if (err) return callback(err);
//                     // Check that a session was found
//                     if (sessionRes === undefined || sessionRes === null) {
//                       return callback(null, null);
//                     } else {
//                       sessionObj = sessionRes;
//                       return callback();
//                     }
//                   });
//                 },
//                 // Load User Device
//                 function(callback) {
//                   var query = { _id: reqData.device_id, user_id: sessionObj.user_id };
//                   var userDeviceJson = {};
//                   helper.genUpdatedDate(function(helperRes) {
//                     userDeviceJson = { 'timestamps.updated': helperRes,
//                       'timestamps.last_used': helperRes };
//                   });
//                   userDeviceJson.status = 'activated';
//                   log.warn('UserDevice 2 in : ' + new Date().getTime());
//                   UserDevice.findOneAndUpdate(query, userDeviceJson, updateOptions, function(err, userDeviceRes) {
//                     log.warn('UserDevice 2 out : ' + new Date().getTime());
//                     if (err) return callback(err);
//                     // Check that a user device was found
//                     if (userDeviceRes === undefined || userDeviceRes === null) {
//                       return callback(null, null);
//                     } else {
//                       return callback();
//                     }
//                   });
//                 }
//               ], function(err) { // This function gets called after the all tasks have called their "task callback"
//                 if (err) return callback(err);
//                 // Here sessionObj will be populated with user response
//                 return callback(null, sessionObj);
//               });
//             }
//           }
//         });
//       }
//     });
//   } catch (err) {
//     return callback(err);
//   }
// };
//
// module.exports.twilioCustomize = function(reqData, callback) {
//   try {
//     // Define variable here, so all tasks can access the variable
//     var userObj;
//     var sessionObj;
//     var options = { new: true };
//
//     async.series([
//       // Load Device
//       function(callback) {
//         var query = { device_id: reqData.device_id };
//         log.warn('Device 3 in : ' + new Date().getTime());
//         Device.findOne(query, function(err, deviceRes) {
//           log.warn('Device 3 out : ' + new Date().getTime());
//           if (err) return callback(err);
//           // Check that a device was found
//           if (deviceRes === undefined || deviceRes === null) {
//             //	        			return callback(null, null)
//             return callback(new Error(msg.twilioDeviceId));
//             //	        			return callback(null, msg.twilioDeviceId)
//           } else {
//             return callback();
//           }
//         });
//       },
//       // Load User
//       function(callback) {
//         var query = { phone_number: reqData.phone_number };
//         var userJson = {};
//         helper.genUpdatedDate(function(helperRes) {
//           userJson = { 'timestamps.updated': helperRes,
//             'timestamps.last_used': helperRes };
//         });
//         log.warn('User 3 in : ' + new Date().getTime());
//         User.findOneAndUpdate(query, userJson, options, function(err, userRes) {
//           log.warn('User 3 out : ' + new Date().getTime());
//           if (err) return callback(err);
//           // Check that a user was found
//           if (userRes === undefined || userRes === null) {
//             //	        			return callback(null, null)
//             return callback(new Error(msg.phoneNumberDeviceIdNotMatch));
//             //	        			return callback(null, msg.phoneNumberDeviceIdNotMatch)
//           } else {
//             userObj = userRes;
//             return callback();
//           }
//         });
//       },
//       // Load User Device
//       function(callback) {
//         var query = { _id: reqData.device_id, user_id: userObj._id };
//         var userDeviceJson = {};
//         helper.genUpdatedDate(function(helperRes) {
//           userDeviceJson = { 'timestamps.updated': helperRes,
//             'timestamps.last_used': helperRes };
//         });
//         log.warn('UserDevice 3 in : ' + new Date().getTime());
//         UserDevice.findOneAndUpdate(query, userDeviceJson, options, function(err, userDeviceRes) {
//           log.warn('UserDevice 3 out : ' + new Date().getTime());
//           if (err) return callback(err);
//           // Check that a user device was found
//           if (userDeviceRes === undefined || userDeviceRes === null) {
//             //	        			return callback(null, null)
//             return callback(new Error(msg.phoneNumberDeviceIdNotMatch));
//             //	        			return callback(null, msg.phoneNumberDeviceIdNotMatch)
//           } else {
//             return callback();
//           }
//         });
//       },
//       // Load Session
//       function(callback) {
//         var md5 = crypto.createHash('md5').update(reqData.phone_number.toString() + Date.now()).digest('hex');
//         var query = { user_id: userObj._id, device_id: reqData.device_id };
//         var sessionJson = { token: md5 };
//         helper.genExpireToken(function(helperRes) {
//           sessionJson.expires_at = helperRes;
//         });
//         log.warn('Session 3 in : ' + new Date().getTime());
//         Session.findOneAndUpdate(query, sessionJson, options, function(err, sessionRes) {
//           log.warn('Session 3 out : ' + new Date().getTime());
//           if (err) return callback(err);
//           // Check that a session was found
//           if (sessionRes === undefined || sessionRes === null) {
//             return callback(new Error(msg.twilioDeviceId));
//             //	        			return callback(null, msg.twilioDeviceId)
//           } else {
//             sessionObj = sessionRes;
//             return callback();
//           }
//         });
//       }
//     ], function(err) { // This function gets called after the all tasks have called their "task callback"
//       if (err) return callback(err);
//       // Here sessionObj will be populated with user response
//       return callback(null, sessionObj);
//     });
//   } catch (err) {
//     return callback(err);
//   }
// };
