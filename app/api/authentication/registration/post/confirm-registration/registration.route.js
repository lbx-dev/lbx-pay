const apiPrefix = require('app/api/common/constants/constants.service').constants.url.API_PREFIX;
const controller = require('./registration.controller');

async function confirmRegistrationRoute(req, res) {
  const response = await controller.handleCall(req.body, req.headers.language);

  res.status(response.code).json(response.payload);
}

/**
 * @api {post} /api/confirm 03 - Confirm registration
 * @apiName Confirm registration
 * @apiGroup Authentication
 * @apiDescription Api endpoint that confirms registration of the new user
 *
 * @apiVersion 0.0.1
 *
 * @apiParam (Body) {String} confirmationToken token
 *
 * @apiSuccess {String} message A success message
 *
 * @apiError (Bad request 400) {String} REGISTRATION_NO_CONFIRMATION_TOKEN Happens when no token is provided
 * @apiError (Not found 404) {String} CONFIRMATION_USER_NOT_FOUND Happens when no user is found
 *
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_SERVER_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *

 */

module.exports = function (app) {
  app.post(apiPrefix + '/confirm', confirmRegistrationRoute);
};