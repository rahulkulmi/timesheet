// 'use strict';
// var response = require('../services/api_response');
// var authService = require('../services/auth_service');
// var twilioService = require('../services/twilio_service');
// var appException = require('../app_util/exceptions');
// var msg = require('../app_util/messages');
//
// module.exports.registerUser = function(req, res) {
//   try {
//     // TODO: remove validation from controller
//     req.checkBody('phone_number', msg.invalidPhoneNumber).notEmpty().isInt();
//     req.checkBody('phone_country_code', msg.invalidPhoneCountryCode).notEmpty().isInt();
//     req.checkBody('device_id', msg.invalidDeviceId).notEmpty().isAlpha();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.BAD_REQUEST(msg.validationError + ' : ' + errors[0].msg));
//     }
//
//     // TODO: get process id
//     authService.authRegister(req.body, function(err, authRes) {
//       // TODO: remove this common code from every controller
//       if (err) {
//         response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//       } else if (authRes === undefined || authRes === null) {
//         response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR());
//       } else {
//         var reqData = req.body;
//         reqData.security_code = authRes.security_code;
//         twilioService.sendCode(reqData, function(err, twilioRes) {
//           if (err) {
//             response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//           } else {
//             response.successResponse(req, res, msg.codeSend);
//           }
//         });
//       }
//     });
//   } catch (err) {
//     // TODO: remove catch block
//     response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//   }
// };
//
// module.exports.verifyUser = function(req, res) {
//   try {
//     req.checkBody('phone_number', msg.invalidPhoneNumber).notEmpty().isInt();
//     req.checkBody('phone_country_code', msg.invalidPhoneCountryCode).notEmpty().isInt();
//     req.checkBody('security_code', msg.invalidSecurityCode).notEmpty().isInt();
//     var errors = req.validationErrors();
//     if (errors) {
//       return response.errorResponse(req, res, appException.BAD_REQUEST(msg.validationError + ' : ' + errors[0].msg));
//     }
//
//     authService.authVerify(req.body, function(err, authRes) {
//       if (err) {
//         response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//       } else if (authRes === undefined || authRes === null) {
//         response.errorResponse(req, res, appException.RECORD_NOT_FOUND());
//       } else if (authRes === msg.tokenExpired) {
//         response.errorResponse(req, res, appException.VERIFICATION_EXCEPTION(authRes));
//       } else {
//         response.successResponse(req, res, authRes, msg.userVerified);
//       }
//     });
//   } catch (err) {
//     response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//   }
// };
//
// module.exports.userStatus = function(req, res) {
//   try {
//     response.successResponse(req, res, msg.userVerified);
//   } catch (err) {
//     response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
//   }
// };
