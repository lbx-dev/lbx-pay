const service = require('./security.service');
const { responses } = require('app/api/common/responses/responses.service');
const logger = require('app/common/log/logger.service');

async function resolve(token, request, response) {
  const { language } = request.headers;

  try {
    await service.resolveSecurity(token, request);
  } catch(error) {
    if(Number(error.errno) === 5) {
      return resolve(token, request, response);
    }

    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error.message });
    return responses[language].UNKNOWN_SERVER_ERROR;
  }
  return service.shouldContinue(request, response);
}

module.exports = {
  resolve
};