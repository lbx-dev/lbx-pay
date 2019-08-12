const logger = require('app/common/log/logger.service');
const { validCall, responses } = require('app/api/common/responses/responses.service');
const { transformArray } = require('app/api/common/transform-database-data/transform-data.service');
const databaseService = require('app/database/database.service');

async function getBondPlans(language) {
  const { persistence: database } = databaseService.get();

  const sql = `
    SELECT * FROM "public"."growth_bond";
  `;

  try {
    const { rows } = await database.raw(sql);

    return validCall({
      growthBonds: transformArray(rows)
    });
  }catch(error) {
    logger.error('Database failed');
    logger.log({ level: 'error', message: error });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}

module.exports = {
  getBondPlans
};