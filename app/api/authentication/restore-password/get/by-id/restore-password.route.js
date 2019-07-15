const apiPrefix = require('app/api/common/constants/constants.service').constants.url.API_PREFIX;
const controller = require('./restore-password.controller');

async function checkRestorePasswordRoute(req, res) {
  const response = await controller.handleCall(req.params.restorationToken, req.headers.language);

  res.status(response.code).json(response.payload);
}
/**
 * @api {get} /api/restore-password/:restorationToken/check 05 - Check if you can restore password
 * @apiName Check password restoration
 * @apiGroup Authentication
 * @apiDescription Api endpoint that checks whether restoration is possible
 *
 * @apiVersion 0.0.1
 *
 * @apiParam (Body) {Param} restorationToken restorationToken
 *
 * @apiSuccess {String} RESTORE_PASSWORD_POSSIBLE A success message
 *
 * @apiError (Not found 404) {String} RESTORE_PASSWORD_IMPOSSIBLE Happens when there is no restoration token in memory.
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_DATABASE_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *

 */

module.exports = function (app) {
  app.get(apiPrefix + '/restore-password/:restorationToken/check', checkRestorePasswordRoute);
};