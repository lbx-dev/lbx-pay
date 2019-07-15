const databaseService = require('app/database/database.service');
async function getRoles() {
  const { persistence: database } = databaseService.get();

  const result = await database.raw(`
    SELECT * FROM "public"."role"
  `);
  return result.rows;
}
module.exports = {
  getRoles
};