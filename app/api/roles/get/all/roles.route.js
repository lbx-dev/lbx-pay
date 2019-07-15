const controller = require('./roles.controller');
const { RANDOM_SECURITY } = process.env;
const { responses } = require('app/api/common/responses/responses.service');
const { constants } = require('app/api/common/constants/constants.service');
const apiPrefix = constants.url.API_PREFIX;

async function getAllRolesRoute(req, res) {
  let response;

  const { language, security } = req.headers;
  const { role } = security;
  const { id: roleId } = role;


  if(security.token === RANDOM_SECURITY || roleId !== constants.users.roles.NOT_LOGGED_IN) {
    response = await controller.getRoles(language);
  } else {
    response = responses[language].ROLES_UNAUTHORIZED;
  }

  res.status(response.code).json(response.payload);
}
/**
 * @api {get} /api/roles/ 01 - List existing roles on server
 * @apiName Get roles
 * @apiGroup Role
 * @apiDescription Api endpoint that fetches roles from the server.
 *
 * @apiVersion 0.0.1
 *
 *
 * @apiSuccess {Array} roles Array of roles
 * @apiSuccess {Integer} roles.id The ID
 * @apiSuccess {String} roles.name Name of the role
 * @apiSuccessExample {json} Success-Response:
 {
    "roles": [
        {
            "id": "ad34041d-4c06-49b6-831a-55bca296d8ac",
            "name": "administrator"
        },
        {
            "id": "a0ee7a6d-4348-41a5-b1b9-39e66dbbe32a",
            "name": "user"
        }
    ]
}
 * @apiError (Unauthorized 401) {String} ROLES_UNAUTHORIZED Happens when the request is not authorized either by logging in or by random token
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_SERVER_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *
 */

module.exports = function (app) {
  app.get(apiPrefix + '/roles', getAllRolesRoute);
};