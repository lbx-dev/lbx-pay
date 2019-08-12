const controller = require('./pay.controller');

const { constants } = require('app/api/common/constants/constants.service');
const { responses } = require('app/api/common/responses/responses.service');
const { addSecured } = require('app/api/authentication/security/security.service');

const apiPrefix = constants.url.API_PREFIX;

async function depositToSavingsRoute(req, res) {
  const { language, security } = req.headers;

  const { role, id: userId } = security;
  const { id: roleId } = role;

  let response = responses[language].AUTHORIZATION_FORBIDDEN;
  if(roleId === constants.users.roles.USER) {
    response = await controller.handleCall(userId, req.body, language);
  }

  res.status(response.code).json(response.payload);
}

module.exports = function(app) {
  const url = `${ apiPrefix }/pay/deposit`;

  addSecured({ url, method: 'POST' });
  app.post(url, depositToSavingsRoute);
};