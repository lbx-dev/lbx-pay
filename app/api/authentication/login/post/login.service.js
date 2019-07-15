const { responses } = require('app/api/common/responses/responses.service');
const emailValidation = require('app/api/common/validation/emails/emails-validation.service');
const databaseService = require('app/database/database.service');

function validateCall(body, language) {

  if(Object.keys(body).length !== 2) {
    return responses[language].LOGIN_INVALID_DETAILS;
  } else if(!emailValidation.isValid(body.email)) {
    return responses[language].LOGIN_INVALID_EMAIL;
  } else if(!body.password) {
    return responses[language].LOGIN_NO_PASSWORD;
  }
}

async function checkLogin(details, language) {
  let user;

  const { persistence: database } = databaseService.get();
  async function transaction(t) {
    const findUserSQL = `
      SELECT
        u.id AS id,
        u.first_name,
        u.last_name,
        u.email,
        r.id AS role_id,
        r.name AS role_name
      FROM 
        "public"."user" AS u
      JOIN
        "public"."users_roles" AS ur on ur.user_id = u.id
      JOIN
        "public"."role" AS r ON r.id = ur.role_id
      WHERE 
        u.email = ?`;
    const findUserSecurity = `
      SELECT 
        *
      FROM 
        "public"."security"
      WHERE
        user_id = ?
    `;

    const { rows: users, rowCount: count } = await t.raw(findUserSQL, details.email);

    if(count !== 1) {
      throw responses[language].LOGIN_NO_USER_FOUND;
    }
    const { rows: security } = await t.raw(findUserSecurity, users[0].id);

    if(details.password === security[0].security) {
      if(!security[0].confirmed) {
        throw responses[language].LOGIN_USER_NOT_CONFIRMED;
      } else if(security[0].disabled) {
        throw responses[language].LOGIN_USER_DISABLED;
      }
    } else {
      throw responses[language].LOGIN_NO_USER_FOUND;
    }
    user = users[0];

  }
  await database.transaction(transaction);

  return user;
}
async function findUserByEmail(email) {
  const { persistence: database } = databaseService.get();

  const { rows } = await database.raw('SELECT * FROM "public"."user" WHERE email = ?', [ email ]);

  return rows[0];
}

module.exports = {
  validateCall,
  checkLogin,
  findUserByEmail
};