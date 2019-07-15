const apiPrefix = require('app/api/common/constants/constants.service').constants.url.API_PREFIX;
const controller = require('./restore-password.controller');

async function restorePasswordRoute(req, res) {
  const response = await controller.handleCall(req.body, req.headers.language);

  res.status(response.code).json(response.payload);
}
/**
 * @api {post} /api/restore-password 06 - Restore password
 * @apiName Restore password
 * @apiGroup Authentication
 * @apiDescription Api endpoint that finishes forgot password procedure. Note that it will finish successfully even
 * when there is no such email in the database
 *
 * @apiVersion 0.0.1
 *
 * @apiParam (Body) {String} restorationToken restorationToken
 * @apiParam (Body) {String} password password
 *
 * @apiSuccess {String} RESTORE_PASSWORD_SUCCESS A success message
 *
 * @apiError (Bad request 400) {String} RESTORE_PASSWORD_INVALID_DETAILS Happens when body does not contain necessary data only
 * @apiError (Bad request 400) {String} RESTORE_PASSWORD_NO_PASSWORD Happens when password is not provided
 * @apiError (Bad request 400) {String} RESTORE_PASSWORD_INVALID_RESTORATION_TOKEN Happens when invalid restoration token is provided
 * @apiError (Not found 404) {String} RESTORE_PASSWORD_NO_USER_FOUND Happens when no user was found
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_SERVER_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *

 */

module.exports = function (app) {
  app.post(apiPrefix + '/restore-password', restorePasswordRoute);
};