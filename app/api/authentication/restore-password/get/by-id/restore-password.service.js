const databaseService = require('app/database/database.service');

async function isRestorationPossible(restorationToken) {
  const { memory: database } = databaseService.get();

  const restorationTokenExists = `
    SELECT
      count(*) AS count
    FROM 
      restoration 
    WHERE 
      restoration_token = ?;
  `;
  const response = await database.raw(restorationTokenExists, [ restorationToken ]);

  return response[0].count > 0;
}


module.exports = {
  isRestorationPossible
};