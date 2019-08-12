const UUIDPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
const ZipCodePattern = '^[0-9]{5}(?:-[0-9]{4})?$';

const patternValidationService = require('app/api/common/validation/pattern/pattern-validation.service');

function isString(string) {
  return !(typeof string !== 'string' && !(string instanceof String));
}
function isUUID(string) {
  return patternValidationService.isValid(string, UUIDPattern);
}
function isZipCode(string) {
  return patternValidationService.isValid(string, ZipCodePattern);
}
module.exports = {
  isString,
  isUUID,
  isZipCode
};

