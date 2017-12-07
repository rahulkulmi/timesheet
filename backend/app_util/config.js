'use strict';

function appConfig() {

  var env = require('node-env-file');
  env(__dirname + '/../.env');
  var mongoose = null;

  function initDB() {
    if (mongoose !== null) {
      return mongoose;
    }
    mongoose = require('mongoose');

    // var uri = env.MONGO_URI + env.MONGO_DB;
    var uri = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/slackdb';
    // var uri = 'mongodb://127.0.0.1:27017/slackdb';
    console.log(uri);
    var options = {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: 1,
      reconnectTries: 30
    };

    mongoose.connect(uri, options);
    return mongoose;
  }

  return {
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    SENDGRID_KEY: process.env.SENDGRID_KEY,

    MONGOOSE_INSTANCE: initDB()
  };
}

//Export configuration object
module.exports = appConfig();
