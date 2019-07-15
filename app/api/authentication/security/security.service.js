const memoryService = require('app/api/authentication/authentication.service');
const { constants } = require('app/api/common/constants/constants.service');
const { responses } = require('app/api/common/responses/responses.service');
const { PathPatternWithParams } = require('path-pattern');

const secured = [];

function createSecurityModel(token, session) {
  if(!session) {
    return {
      token,
      role: {
        id: constants.users.roles.NOT_LOGGED_IN
      }
    };
  }
  return {
    token,
    id: session.user_id,
    role: {
      id: session.role_id,
      name: session.role_name
    },
    firstName: session.first_name,
    lastName: session.last_name,
    email: session.email,
    partner: session.partner_id ? {
      id: session.partner_id,
      name: session.partner_name,
      verified: !!session.partner_verified
    } : null
  };

}

function shouldContinue(req) {
  const { language, security } = req.headers;
  const { partner: partnerEnrolled } = security;

  let shouldBePartner;

  const isSecured = !!secured
    .find((element) => {

      const ret =(element.method === req.method) &&
        (new PathPatternWithParams(element.url))
          .match(req.baseUrl);

      if(ret) {
        shouldBePartner = element.partner;
      } else {
        shouldBePartner = false;
      }
      return ret;
    });

  const isLoggedOut = constants.users.roles.NOT_LOGGED_IN === security.role.id;
  const isAdministrator = constants.users.roles.ADMINISTRATOR === security.role.id;

  if(isLoggedOut && isSecured) {
    return responses[language].AUTHORIZATION_NOT_LOGGED_IN;
  } else if(shouldBePartner && !partnerEnrolled && !isAdministrator) {
    return responses[language].AUTHORIZATION_USER_NOT_IN_PARTNER_ORGANIZATION;
  }
}

async function resolveSecurity(token, request) {
  if(!token) {
    request.headers.security = createSecurityModel();
  } else {
    request.headers.security = createSecurityModel(token, await memoryService.getSessionById(token));
  }
}

function addSecured(route) {
  secured.push(route);
}

module.exports = {
  addSecured,
  resolveSecurity,
  shouldContinue
};