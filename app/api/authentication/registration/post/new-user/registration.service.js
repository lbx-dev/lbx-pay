const stringValidation = require('app/api/common/validation/string/string-validation.service');
const emailValidation = require('app/api/common/validation/emails/emails-validation.service');

const { responses, composeEmail, sendEmail } = require('app/api/common/responses/responses.service');
const { constants } = require('app/api/common/constants/constants.service');
const databaseService = require('app/database/database.service');

const keccak = require('keccak');

const logger = require('app/common/log/logger.service');

function validateCall(body, language) {
  if(Object.keys(body).length !== 5) {
    return responses[language].REGISTRATION_INVALID_DETAILS;
  } else if(!stringValidation.isString(body.firstName) || body.firstName.length > 128 || body.firstName.length === 0) {
    return responses[language].REGISTRATION_INVALID_FIRST_NAME;
  } else if(!stringValidation.isString(body.lastName) || body.lastName.length > 128 || body.lastName.length === 0) {
    return responses[language].REGISTRATION_INVALID_LAST_NAME;
  } else if(!emailValidation.isValid(body.email) || body.email.length > 128 || body.email.length === 0) {
    return responses[language].REGISTRATION_INVALID_EMAIL;
  } else if(body.roleId === constants.users.roles.ADMINISTRATOR) {
    return responses[language].REGISTRATION_CANNOT_BE_ADMINISTRATOR;
  } else if(!stringValidation.isString(body.password) || body.password.length === 0) {
    return responses[language].REGISTRATION_NO_PASSWORD;
  }
}
function createConfirmationToken() {
  return keccak('keccak512').update(`User registered at ${new Date()}. Random ${Math.random()}`).digest('hex');
}
function createHashedPassword(password) {
  return keccak('keccak512').update(password).digest('hex');
}
function sendConfirmationEmail(user, language) {
  return sendEmail(composeEmail.REGISTRATION_CONFIRMATION(user, language));
}

async function saveNewUser(user, language, autoValidate) {
  const { persistence: database } = databaseService.get(),
    createNewUserSQL = `
      WITH inserted_user AS (
        INSERT INTO
          "public"."user" (email, first_name, last_name)
        VALUES
          (?, ?, ?)
        RETURNING id
      ),
      inserted_security AS (
        INSERT INTO 
          "public"."security" (user_id, security, confirmation_token, confirmed)
        SELECT id, ?, ?, ? FROM inserted_user
      )
     INSERT INTO
      "public"."users_roles" (user_id, role_id)
      SELECT (SELECT id FROM inserted_user), (SELECT id FROM "public"."role" WHERE name = 'user');`;


  user.confirmationToken = createConfirmationToken();
  try {
    await database.raw(createNewUserSQL, [
      user.email,
      user.firstName,
      user.lastName,
      user.password,
      user.confirmationToken,
      !!autoValidate
    ]);

    if(!autoValidate && !process.env.INTEGRATION_TESTING) {
      await sendConfirmationEmail(user, language);
    }

    return responses[language].REGISTRATION_SUCCESSFUL;
  } catch(error) {
    error.code = Number(error.code);
    if(error.code === constants.database.DUPLICATE_KEY) {
      return responses[language].REGISTRATION_FAILED_USER_ALREADY_REGISTERED;
    } else if(error.code === constants.database.FOREIGN_KEY_VIOLATION) {
      return responses[language].REGISTRATION_FAILED_NO_SUCH_ROLE;
    }

    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error });
    return responses[language].UNKNOWN_SERVER_ERROR;
  }
}

module.exports = {
  validateCall,
  createHashedPassword,
  saveNewUser
};