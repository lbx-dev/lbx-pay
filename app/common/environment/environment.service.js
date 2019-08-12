function getEnvironment() {
  if(process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'development';
}

function getBaseUrl() {
  const environment = getEnvironment();

  if(environment === 'development') {
    return 'http://localhost:3010';
  } else if(environment === 'staging' && process.env.INTEGRATION_TESTING) {
    return 'http://localhost:3010';
  } else if(environment === 'staging') {
    return 'https://staging-pay.lbx.com';
  } else if(environment === 'production') {
    return 'https://pay.lbx.com';
  }
  return 'http://localhost:3010';
}

module.exports = {
  environment: getEnvironment(),
  baseURL: getBaseUrl()
};
