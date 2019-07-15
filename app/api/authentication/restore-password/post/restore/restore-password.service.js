const keccak = require('keccak');
const stringValidation = require('app/api/common/validation/string/string-validation.service');

const { responses } = require('app/api/common/responses/responses.service');

const databaseService = require('app/database/database.service');

function validate(body, language) {
  if(Object.keys(body).length !== 2) {
    return responses[language].RESTORE_PASSWORD_INVALID_DETAILS;
  } else if(!stringValidation.isString(body.restorationToken) || body.restorationToken.length === 0) {
    return responses[language].RESTORE_PASSWORD_INVALID_RESTORATION_TOKEN;
  } else if(!stringValidation.isString(body.password) || body.password.length === 0) {
    return responses[language].RESTORE_PASSWORD_NO_PASSWORD;
  }
}
function createHashedPassword(password) {
  return keccak('keccak512').update(password).digest('hex');
}

async function restorePassword({ password, restorationToken }) {
  const { persistence, memory } = databaseService.get();

  const setPasswordByRecoveryToken = `
    UPDATE 
      "public"."security" 
    SET 
      security = ?,
      restoration_token = null
    WHERE 
      restoration_token = ?;
  `;
  const deleteRecoveryTokenFromMemory = `
    DELETE FROM 
      restoration 
    WHERE 
      restoration_token = ?;
  `;

  let retVal = false;

  async function transaction(t) {
    await memory.raw(deleteRecoveryTokenFromMemory, [ restorationToken ]);
    const { rowCount } = await t.raw(setPasswordByRecoveryToken, [ password, restorationToken ]);
    retVal = !(rowCount === 0);
  }

  await persistence.transaction(transaction);
  return retVal;
}


module.exports = {
  validate,
  createHashedPassword,
  restorePassword
};