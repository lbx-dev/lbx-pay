const apiPrefix = require('app/api/common/constants/constants.service').constants.url.API_PREFIX;
const controller = require('./forgot-password.controller');

async function forgotPasswordRoute(req, res) {
  const response = await controller.handleCall(req.body, req.headers.language);

  res.status(response.code).json(response.payload);
}
/**
 * @api {post} /api/forgot-password 04 - Forgot password
 * @apiName Forgot password
 * @apiGroup Authentication
 * @apiDescription Api endpoint that starts forgot password procedure. Note that it will finish successfully even
 * when there is no such email in the database
 *
 * @apiVersion 0.0.1
 *
 * @apiParam (Body) {String{128}} email Username
 *
 * @apiSuccess {String} FORGOT_PASSWORD_CALL_SUCCESSFUL A success message
 *
 * @apiError (Bad request 400) {String} FORGOT_PASSWORD_INVALID_DETAILS Happens when body does not contain email only
 * @apiError (Bad request 400) {String} FORGOT_PASSWORD_INVALID_EMAIL Happens when invalid email address is provided
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_SERVER_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *

 */

module.exports = function (app) {
  app.post(apiPrefix + '/forgot-password', forgotPasswordRoute);
};