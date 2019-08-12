const { responses } = require('app/api/common/responses/responses.service');
const databaseService = require('app/database/database.service');
const payService = require('app/api/common/pay/LBXPay');

function validateCall(body, language) {
  if(!body.confirmationToken) {
    return responses[language].REGISTRATION_NO_CONFIRMATION_TOKEN;
  }
}

function confirmRegistration({ confirmationToken: token }, language) {
  const { persistence: database } = databaseService.get();

  async function transaction(t) {
    const findUserSQL = `
      SELECT 
        user_id,
        count(*) AS count
      FROM 
        "public"."security"
      WHERE
        confirmation_token = ?
        GROUP BY user_id
    `;
    const confirmUserSQL = `
      UPDATE
        "public"."security"
      SET
        confirmed = true
      WHERE 
        confirmation_token = ?;
    `;

    const { rows: found, rowCount } = await t.raw(findUserSQL, [ token ]);

    if(rowCount === 0 || Number(found[0].count) === 0) {
      throw responses[language].CONFIRMATION_USER_NOT_FOUND;
    }

    await t.raw(confirmUserSQL, [ token ]);
    await payService.createAddress(found[0].user_id);
  }
  return database.transaction(transaction);
}
module.exports = {
  validateCall,
  confirmRegistration
};