const defaultConfig = require('./configuration');

function getConfiguration() {
  if(process.env.EMAIL_HOST) {
    defaultConfig.host = process.env.EMAIL_HOST;
  }
  if(process.env.EMAIL_PORT) {
    defaultConfig.port = process.env.EMAIL_PORT;
  }
  if(process.env.EMAIL_SECURE) {
    defaultConfig.secure = process.env.EMAIL_SECURE;
  }
  if(process.env.EMAIL_USERNAME) {
    defaultConfig.auth.user = process.env.EMAIL_USERNAME;
  }
  if(process.env.EMAIL_PASSWORD) {
    defaultConfig.auth.pass = process.env.EMAIL_PASSWORD;
  }
  return defaultConfig;
}

module.exports = getConfiguration();
