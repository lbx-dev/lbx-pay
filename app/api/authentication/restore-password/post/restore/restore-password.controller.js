const service = require('./restore-password.service');
const logger = require('app/common/log/logger.service');
const { responses } = require('app/api/common/responses/responses.service');

async function handleCall(body, language) {
  const validation = service.validate(body, language);

  if(validation) {
    return validation;
  }
  body.password = service.createHashedPassword(body.password);

  try {
    if(await service.restorePassword(body)) {
      return responses[language].RESTORE_PASSWORD_SUCCESS;
    }
    return responses[language].RESTORE_PASSWORD_NO_USER_FOUND;
  } catch(error) {
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error.message });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}

module.exports = {
  handleCall
};