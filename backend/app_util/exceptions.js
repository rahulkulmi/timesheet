'use strict';
module.exports = {
  NOT_AUTHORIZED: function(customMsg) {
    return {'rcode': 401, 'httpCode': 401,
      'message': 'No authorization', 'customMsg': customMsg};
  },
  INTERNAL_SERVER_ERROR: function(customMsg) {
    return {'rcode': 500, 'httpCode': 500,
      'message': 'Server encountered some problem', 'customMsg': customMsg};
  },
  BAD_REQUEST: function(customMsg) {
    return {'rcode': 400, 'httpCode': 400,
      'message': 'Bad request', 'customMsg': customMsg};
  },
  FILE_NOT_FOUND: function(customMsg) {
    return {'rcode': 404, 'httpCode': 503,
      'message': 'File not found', 'customMsg': customMsg};
  },
  RECORD_NOT_FOUND: function(customMsg) {
    return {'rcode': 404, 'httpCode': 503,
      'message': 'Record not found', 'customMsg': customMsg};
  },
  VERIFICATION_EXCEPTION: function(customMsg) {
    return {'rcode': 402, 'httpCode': 402,
      'message': 'Verification exception.', 'customMsg': customMsg};
  },
  VALIDATION_EXCEPTION: function(rcode, customMsg) {
    return {'rcode': rcode, 'httpCode': 400,
      'message': 'Bad request', 'customMsg': customMsg};
  },
  ROUTE_NOT_FOUND: function(customMsg) {
    return {'rcode': 404, 'httpCode': 404,
      'message': 'Route not found', 'customMsg': customMsg};
  }
};
