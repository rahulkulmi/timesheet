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

     //var uri = process.env.MONGODB_URI_URI || process.env.MONGO_URI+ process.env.MONGO_DB;

    // Production app uri for mongodb
    var uri = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/slackdb';
    
    // heroku uri for mongodb
    //var uri = 'mongodb://heroku_salary_slip:newput123@ds151997.mlab.com:51997/heroku_08lcthpj'

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
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    SENDGRID_KEY: process.env.SENDGRID_KEY,
    //EMAIL_IDS: process.env.EMAIL_IDS,
    WEEKLY_EMAIL_IDS: process.env.WEEKLY_EMAIL_IDS,
    MONTHLY_EMAIL_IDS: process.env.MONTHLY_EMAIL_IDS,
    ROOT_PATH: process.env.ROOT_PATH,
    ADMIN_EMAIL_IDS: process.env.ADMIN_EMAIL_IDS,
    BOT_ROOT_PATH: process.env.BOT_ROOT_PATH,
    SALARY_ADMIN_EMAIL: process.env.SALARY_ADMIN_EMAIL || 'anjana@newput.com',

    MONGOOSE_INSTANCE: initDB()
  };
}

//Export configuration object
module.exports = appConfig();
