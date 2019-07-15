const { constants } = require('app/api/common/constants/constants.service');
const apiPrefix = constants.url.API_PREFIX;
const controller = require('app/api/authentication/login/post/login.controller');

async function loginRoute(req, res) {
  const response = await controller.handleLogin(req.body, req.headers.language);

  res.status(response.code).json(response.payload);

}
async function loginFacebookRoute(req, res) {
  const response = await controller.handleFacebookLogin(req.body, req.headers.language);

  res.status(response.code).json(response.payload);

}

/**
 * @api {post} /api/login 01 - Log in
 * @apiName Login
 * @apiGroup Authentication
 * @apiDescription Api endpoint that logs in the user
 *
 * @apiVersion 0.0.1
 *
 * @apiParam (Body) {String{128}} email Username
 * @apiParam (Body) {String} password Password
 *
 * @apiSuccess {String} ks-security token that is used to identify the user later on
 * @apiSuccess {Object} user User model
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.firstName User first name
 * @apiSuccess {String} user.lastName User last name
 * @apiSuccess {String} user.email User email
 * @apiSuccess {Number} user.roleId User roleId
 * @apiSuccess {String} user.roleName User roleName
 *
 * @apiSuccessExample {json} Success-Response:
 {
    "ks-security": "4576e411521fdbface9fbf0f3ced54ac71732732984d723e42bd22e10b51401659411feed3ed61db312cb2fe38aa3ebcdfb85afcf400e57696ef0a06e0f49c5a",
    "user": {
        "id": 1,
        "firstName": "Test",
        "lastName": "Test",
        "email": "test@test.com",
        "roleId": 1,
        "roleName": "administrator"
    }
 }
 * @apiError (Bad request 400) {String} LOGIN_INVALID_DETAILS Happens when body does not contain username and password only
 * @apiError (Bad request 400) {String} LOGIN_INVALID_USERNAME Happens when invalid username is provided (Should be a String not bigger than 32 characters)
 * @apiError (Bad request 400) {String} LOGIN_NO_PASSWORD Happens when no password is provided
 * @apiError (Not found 404) {String} LOGIN_NO_USER_FOUND Happens when there is no user with given username and password
 * @apiError (Forbidden 403) {String} LOGIN_USER_NOT_VERIFIED Happens when the user provided correct credentials but did not confirm their email
 *
 * @apiError (Internal server error 500) {String} UNKNOWN_SERVER_ERROR Happens when the operation failed for unknown reasons on the database. Should not happen in normal circumstances
 *
 */
module.exports = function (app) {
  app.post(apiPrefix + '/login', loginRoute);
  app.post(apiPrefix + '/login/facebook', loginFacebookRoute);
};