const { responses, validCall } = require('app/api/common/responses/responses.service');
const { constants } = require('app/api/common/constants/constants.service');
const service = require('app/api/authentication/login/post/login.service');
const logger = require('app/common/log/logger.service');
const sessionService = require('app/api/authentication/authentication.service');
const dataTransformService = require('app/api/common/transform-database-data/transform-data.service');
const keccak = require('keccak');

const FB = require('fb');
const registrationService = require('../../registration/post/new-user/registration.service');

function createHashedPassword(password) {
  return keccak('keccak512').update(password).digest('hex');
}
function getUser(details, language) {
  return service.checkLogin(details, language);
}
async function handleLogin(body, language) {

  const validation = service.validateCall(body, language);

  if(validation) {
    return validation;
  }

  let user;
  let sessionId;

  body.password = createHashedPassword(body.password);
  body.email = body.email.toLocaleLowerCase();

  try {
    user = dataTransformService.transform(await getUser(body, language));
    user.role = {
      id: user.roleId,
      name: user.roleName
    };
    delete user.roleId;
    delete user.roleName;
  } catch(error) {

    if(error.code) {
      return error;
    }
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error.message });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }
  try {
    sessionId = await sessionService.createSession(user, language);
  } catch(error) {
    if(error.code) {
      return error;
    }
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error.message });

    return responses[language].UNKNOWN_SERVER_ERROR;
  }

  return validCall({
    'ks-security': sessionId,
    user
  });

}
async function handleFacebookLogin({ accessToken }, language) {
  Promise.promisifyAll(FB);
  let sessionId;

  if(accessToken) {

    try {
      await FB.apiAsync('me', { fields: [ 'id', 'name', 'email' ], access_token: accessToken });
    } catch(user) {
      if(user.error) {
        logger.log({ level: 'error', message: user.error });
        return responses[language].USERS_NOT_FOUND;
      }

      const email = user.email;

      const parts = user.name.split(' ');
      user.firstName = parts[0];
      user.lastName = parts[1];
      user.role = {
        id: constants.users.roles.USER,
        name: 'user'
      };
      user.password = registrationService.createHashedPassword(Math.random().toString());
      user.confirmationToken = registrationService.createHashedPassword(Math.random().toString());

      const found = await service.findUserByEmail(email, language);
      if(!found) {
        try {
          await registrationService.saveNewUser(user, language, true);
        } catch(error) {
          logger.error(`Database error at ${__filename}`);
          logger.log({ level: 'error', message: error.message });

          return responses[language].UNKNOWN_SERVER_ERROR;
        }
        const existingSession = await sessionService.getSessionByEmail(user.email);

        if(existingSession.length > 0) {
          return validCall({
            user,
            'ks-security': existingSession[0].session_id
          });
        }
        try {
          sessionId = await sessionService.createSession(user);
        } catch(error) {
          logger.error(`Database error at ${__filename}`);
          logger.log({ level: 'error', message: error.message });

          return responses[language].UNKNOWN_SERVER_ERROR;
        }
        return validCall({
          user,
          'ks-security': sessionId
        });
      }
      found.firstName = found.first_name;
      found.lastName = found.last_name;

      found.role = {
        id: constants.users.roles.USER,
        name: 'user'
      };
      const existingSession = await sessionService.getSessionByEmail(user.email);
      if(existingSession.length > 0) {
        return validCall({
          user,
          'ks-security': existingSession[0].session_id
        });
      }
      try {
        sessionId = await sessionService.createSession(user);
      } catch(error) {
        logger.error(`Database error at ${__filename}`);
        logger.log({ level: 'error', message: error.message });

        return responses[language].UNKNOWN_SERVER_ERROR;
      }
      return validCall({
        user,
        'ks-security': sessionId
      });
    }
  }
  return responses[language].USERS_NO_TOKEN_PROVIDEDD;

}

module.exports = {
  handleLogin,
  handleFacebookLogin
};