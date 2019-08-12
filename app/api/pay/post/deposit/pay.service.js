const bigNumber = require('bignumber.js');

const { isUUID } = require('app/api/common/validation/string/string-validation.service');
const { responses, invalidCall } = require('app/api/common/responses/responses.service');
const { constants } = require('app/api/common/constants/constants.service');
const databaseService = require('app/database/database.service');
const payService = require('app/api/common/pay/LBXPay');
const logger = require('app/common/log/logger.service');

function validateCall(body, language) {
  if(Object.keys(body).length !== 2) {
    return responses[language].DEPOSIT_INVALID_DETAILS;
  }
  if(!isUUID(body.bondId)) {
    return responses[language].DEPOSIT_INVALID_BOND_ID;
  }
  if(isNaN(bigNumber(body.amount))) {
    return responses[language].DEPOSIT_INVALID_AMOUNT;
  }

  if(body.amount.length > 13) {
    return responses[language].DEPOSIT_INVALID_AMOUNT;
  }
}

async function saveDeposit(userId, body, language) {
  const { persistence: database } = databaseService.get();
  const sql = `
    INSERT INTO
      "public"."deposit" (bond_id, user_id, amount, transaction_id)
    VALUES
      (?, ?, ?, ?);
  `;

  let transactionId = null;

  try {
    const { data } = await payService.deposit(userId, body.amount);
    transactionId = data.txid;
  } catch({ message }) {
    return invalidCall(400, message);
  }


  try {
    await database.raw(sql, [ body.bondId, userId, body.amount, transactionId ]);
    return responses[language].DEPOSIT_SUCCESS;

  } catch({ code, message }) {

    if(Number(code) === constants.database.FOREIGN_KEY_VIOLATION) {
      return responses[language].DEPOSIT_NO_SUCH_GROWTH_PLAN;
    }
    logger.log({ level: 'error', message: message });
    return invalidCall(500, `
      Server failed with message:
        "${ message }"
      However your crypto transaction was successful TxID:
        "${ transactionId }"
      Please contact us for a manual correction
    `);
  }
}

module.exports = { validateCall, saveDeposit };