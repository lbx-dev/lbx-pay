const apiPrefix = require('app/api/common/constants/constants.service').constants.url.API_PREFIX;
const controller = require('./registration.controller');

async function registrationRoute(req, res) {
  const response = await controller.handleCall(req.body, req.headers.language);

  res.status(response.code).json(response.payload);
}

/**
 * @api {post} /api/registration 02 - Registration
 * @apiName Registration
 * @apiGroup Authentication
 * @apiDescription Api endpoint that registers new user
 *
 * @apiVersion 0.0.1
 *
 * @apiParam (Body) {String{128}} firstName First name
 * @apiParam (Body) {String{128}} lastName Last name
 * @apiParam (Body) {String{32}} email Email
 * @apiParam (Body) {UUID} roleId Role id
 * @apiParam (Body) {String} password Password
 *
 * @apiSuccess {String} message A success message
 *
 * @apiError (Bad request 400) {String} REGISTRATION_INVALID_DETAILS Happens when body does not contain only the necessary data
 * @apiError (Bad request 400) {String} REGISTRATION_INVALID_FIRST_NAME Happens when invalid first name is provided (Should be a String not bigger than 128 characters)
 * @apiError (Bad request 400) {String} REGISTRATION_INVALID_LAST_NAME Happens when invalid last name is provided (Should be a String not bigger than 128 characters)
 * @apiError (Bad request 400) {String} REGISTRATION_INVALID_ROLE_ID Happens when invalid role id is provided - should be a positive integer
 * @apiError (Bad request 400) {String} REGISTRATION_FAILED_NO_SUCH_ROLE Happens when role id does not exist in database
 * @apiError (Bad request 400) {String} REGISTRATION_CANNOT_BE_ADMINISTRATOR Happens when user tries to register with Administrator role ID
 * @apiError (Bad request 400) {String} REGISTRATION_INVALID_EMAIL Happens when invalid email is provided
 * @apiError (Bad request 400) {String} REGISTRATION_NO_PASSWORD Happens when no password is provided
 *
 * @apiError (Conflict 409) {String} REGISTRATION_FAILED_USER_ALREADY_REGISTERED Happens when user is already registered
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_SERVER_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *

 */
module.exports = function (app) {
  app.post(apiPrefix + '/registration', registrationRoute);
};