const service = require('./forgot-password.service');
const logger = require('app/common/log/logger.service');
const { responses } = require('app/api/common/responses/responses.service');

async function handleCall(body, language) {
  const validation = service.validate(body, language);

  if(validation) {
    return validation;
  }
  body.email = body.email.toLocaleLowerCase();

  try {
    const user = await service.requestPasswordRestore(body);
    if(user && !process.env.INTEGRATION_TESTING) {
      await service.sendRestorationEmail(user, language);
    }
    return responses[language].FORGOT_PASSWORD_CALL_SUCCESSFUL;
  } catch(error) {
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error.message });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}

module.exports = {
  handleCall
};