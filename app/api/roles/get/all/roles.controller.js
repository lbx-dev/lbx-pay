const service = require('./roles.service');
const { responses, validCall } = require('app/api/common/responses/responses.service');
const logger = require('app/common/log/logger.service');

async function getRoles(language) {
  try {
    return validCall( { roles: await service.getRoles() });
  } catch(error) {
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error });
    logger.log({ level: 'error', message: JSON.stringify(error) });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}
module.exports = {
  getRoles
};