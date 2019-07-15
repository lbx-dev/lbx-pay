const patternValidationService = require('../pattern/pattern-validation.service');
const emailRegex = '^([A-Za-z0-9._%+-]|"|”|“|\\\\| |“.*”){0,64}([A-Za-z0-9_%+-]|"|”|“|\\\\| |“.*”)@[A-Za-z0-9][A-Za-z0-9.-]*\\.[A-Za-z]{2,}$';

function isEmail(email) {
  if(typeof email !== 'string' ||
        email.startsWith('.') ||
        email.startsWith(' ')) {
    return false;
  }
  return patternValidationService.isValid(email, emailRegex) &&
    !patternValidationService.isValid(email, '^.*\\.\\..*$');
}

module.exports = {
  isValid: isEmail
};