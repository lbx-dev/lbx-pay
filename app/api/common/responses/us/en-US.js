const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;

module.exports = {
  AUTHORIZATION_BAD_TOKEN: { code: httpStatus.BAD_REQUEST, payload: 'Bad security token' },
  AUTHORIZATION_NOT_LOGGED_IN: { code: httpStatus.UNAUTHORIZED, payload: 'You must be logged in to see that' },
  AUTHORIZATION_FORBIDDEN: { code: httpStatus.FORBIDDEN, payload: 'You are not allowed to see this' },
  UNKNOWN_SERVER_ERROR: { code: httpStatus.INTERNAL_SERVER_ERROR, payload: 'Something failed' },
  LOGIN_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Invalid login details' },
  LOGIN_INVALID_EMAIL: { code: httpStatus.BAD_REQUEST, payload: 'Invalid email provided' },
  LOGIN_NO_PASSWORD: { code: httpStatus.BAD_REQUEST, payload: 'No password provided' },
  LOGIN_NO_USER_FOUND: { code: httpStatus.NOT_FOUND, payload: 'No user found' },
  LOGIN_USER_NOT_CONFIRMED: { code: httpStatus.FORBIDDEN, payload: 'User not confirmed' },
  LOGIN_USER_DISABLED: { code: httpStatus.BAD_REQUEST, payload: 'User is disabled, contact administrator' },
  CONFIRMATION_USER_NOT_FOUND: { code: httpStatus.NOT_FOUND, payload: 'User not confirmed' },
  CONFIRMATION_USER_ALREADY_CONFIRMED: { code: httpStatus.OK, payload: 'User already confirmed' },
  CONFIRMATION_USER_CONFIRMED: { code: httpStatus.OK, payload: 'User confirmed' },
  REGISTRATION_NO_CONFIRMATION_TOKEN: { code: httpStatus.BAD_REQUEST, payload: 'No confirmation token provided' },
  REGISTRATION_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Invalid registration details' },
  REGISTRATION_INVALID_FIRST_NAME: { code: httpStatus.BAD_REQUEST, payload: 'Invalid first name' },
  REGISTRATION_INVALID_LAST_NAME: { code: httpStatus.BAD_REQUEST, payload: 'Invalid last name' },
  REGISTRATION_INVALID_ROLE_ID: { code: httpStatus.BAD_REQUEST, payload: 'Invalid role id' },
  REGISTRATION_CANNOT_BE_ADMINISTRATOR: {
    code: httpStatus.BAD_REQUEST,
    payload: 'You cannot register to be administrator'
  },
  REGISTRATION_INVALID_EMAIL: { code: httpStatus.BAD_REQUEST, payload: 'Invalid email' },
  REGISTRATION_NO_PASSWORD: { code: httpStatus.BAD_REQUEST, payload: 'No password provided' },
  REGISTRATION_FAILED_USER_ALREADY_REGISTERED: { code: httpStatus.CONFLICT, payload: 'User already registered' },
  REGISTRATION_FAILED_NO_SUCH_ROLE: { code: httpStatus.BAD_REQUEST, payload: 'No such role' },
  REGISTRATION_SUCCESSFUL: { code: httpStatus.CREATED, payload: 'Registration is successful' },
  FORGOT_PASSWORD_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Invalid request details' },
  FORGOT_PASSWORD_INVALID_EMAIL: { code: httpStatus.BAD_REQUEST, payload: 'Invalid email' },
  FORGOT_PASSWORD_CALL_SUCCESSFUL: { code: httpStatus.OK, payload: 'Success! Please check your email' },
  RESTORE_PASSWORD_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Invalid restoration token' },
  RESTORE_PASSWORD_NO_PASSWORD: { code: httpStatus.BAD_REQUEST, payload: 'No password provided' },
  RESTORE_PASSWORD_INVALID_RESTORATION_TOKEN: { code: httpStatus.BAD_REQUEST, payload: 'Invalid restoration token' },
  RESTORE_PASSWORD_NO_USER_FOUND: { code: httpStatus.NOT_FOUND, payload: 'No user found' },
  RESTORE_PASSWORD_POSSIBLE: { code: httpStatus.OK, payload: 'Proceed to restoring password' },
  RESTORE_PASSWORD_IMPOSSIBLE: { code: httpStatus.NOT_FOUND, payload: 'Cannot find restoration token. Try again' },
  RESTORE_PASSWORD_SUCCESS: { code: httpStatus.OK, payload: 'Password updated successfully' },
  ROLES_UNAUTHORIZED: { code: httpStatus.UNAUTHORIZED, payload: 'You are not authorized to see this' },
  DEPOSIT_TOO_LARGE: { code: httpStatus.BAD_REQUEST, payload: 'Deposit is too large, max is 10,000 BTC' },
  DEPOSIT_INVALID_BOND_ID: { code: httpStatus.BAD_REQUEST, payload: 'Invalid bond id' },
  DEPOSIT_INVALID_AMOUNT: { code: httpStatus.BAD_REQUEST, payload: 'Invalid amount' },
  DEPOSIT_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Invalid details' },
  DEPOSIT_NO_SUCH_GROWTH_PLAN: { code: httpStatus.BAD_REQUEST, payload: 'No such growth plan' },
  DEPOSIT_SUCCESS: { code: httpStatus.CREATED, payload: 'Deposit succeeded' },
  ESTIMATE_FEE_NO_AMOUNT: { code: httpStatus.BAD_REQUEST, payload: 'No amount found' }
};