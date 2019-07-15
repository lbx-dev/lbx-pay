const keccak = require('keccak');
const emailValidation = require('app/api/common/validation/emails/emails-validation.service');

const { responses, composeEmail, sendEmail } = require('app/api/common/responses/responses.service');

const databaseService = require('app/database/database.service');
const { transform } = require('app/api/common/transform-database-data/transform-data.service');

function validate(body, language) {
  if(Object.keys(body).length !== 1) {
    return responses[language].FORGOT_PASSWORD_INVALID_DETAILS;
  } else if(!emailValidation.isValid(body.email) || body.email.length > 128 || body.email.length === 0) {
    return responses[language].FORGOT_PASSWORD_INVALID_EMAIL;
  }
}
function createRestorationToken() {
  return keccak('keccak512').update(`User requested a restoration token at ${new Date()}. Random ${Math.random()}`).digest('hex');
}
async function requestPasswordRestore({ email }) {
  const { persistence, memory } = databaseService.get();

  let user = null;

  const findUserSQL = `
    SELECT 
      id, first_name, last_name, email
    FROM 
      "public"."user" 
    WHERE email = ?;`;
  const setRecoveryToken = `
    UPDATE 
      "public"."security" 
    SET 
      restoration_token = ? 
    WHERE 
      user_id = ?;
  `;
  const addRestorationTokenToMemory = `
    INSERT INTO restoration 
    VALUES (?);
  `;

  async function transaction(t) {
    const { rows, rowCount } = await t.raw(findUserSQL, [ email ]);

    if(rowCount === 0) {
      return;
    }

    const restorationToken = createRestorationToken();
    await t.raw(setRecoveryToken, [ restorationToken, rows[0].id ]);

    user = rows[0];
    user.restorationToken = restorationToken;

    await memory.raw(addRestorationTokenToMemory, [ restorationToken ]);
  }

  await persistence.transaction(transaction);

  return user ? transform(user) : false;
}

function sendRestorationEmail(user, language) {
  return sendEmail(composeEmail.PASSWORD_RESTORATION_REQUEST(user, language));
}

module.exports = {
  validate,
  requestPasswordRestore,
  sendRestorationEmail
};