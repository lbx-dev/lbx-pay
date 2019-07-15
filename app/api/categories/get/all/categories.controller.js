const service = require('./categories.service');
const { validCall, responses } = require('app/api/common/responses/responses.service');
const logger = require('app/common/log/logger.service');

async function getCategories(language) {
  try {
    return validCall( { categories: await service.getCategories() });
  } catch(error) {
    logger.error('Database error');
    logger.log({ level: 'error', message: error });
    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}
module.exports = {
  getCategories
};