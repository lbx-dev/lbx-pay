const service = require('./restore-password.service');
const logger = require('app/common/log/logger.service');
const { responses } = require('app/api/common/responses/responses.service');

async function handleCall(restorationToken, language) {

  try {
    if(await service.isRestorationPossible(restorationToken)) {
      return responses[language].RESTORE_PASSWORD_POSSIBLE;
    }
    return responses[language].RESTORE_PASSWORD_IMPOSSIBLE;
  } catch(error) {
    logger.log({ level: 'error', message: 'Database failure' });
    logger.log({ level: 'error', message: error.message });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}

module.exports = {
  handleCall
};