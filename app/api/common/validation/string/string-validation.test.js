const stringValidationService = require('./string-validation.service');
const strings = {
  invalid: [ null, undefined, NaN, 1.2, 13 ],
  valid: [ '', '123', 'test string' ],
  validLongerThanTenCharacters: [ '12345678910' ]
};
const assert = require('assert');

function validStrings () {
  strings.valid.forEach(function (item) {
    assert(stringValidationService.isString(item));
  });
}
function invalidStrings () {
  strings.invalid.forEach(function (item) {
    assert(!stringValidationService.isString(item));
  });
}

describe('Testing services for validation of strings', function () {

  it('Valid strings', validStrings);
  it('Invalid strings', invalidStrings);

});