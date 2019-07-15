const service = require('./registration.service');
const { responses } = require('app/api/common/responses/responses.service');
const logger = require('app/common/log/logger.service');

async function handleCall(body, language) {
  const validation = service.validateCall(body, language);
  if(validation) {
    return validation;
  }
  try {
    await service.confirmRegistration(body, language);

    return responses[language].CONFIRMATION_USER_CONFIRMED;
  } catch(error) {
    error.code = Number(error.code);
    if(error.code) {
      return error;
    }
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}

module.exports = {
  handleCall
};