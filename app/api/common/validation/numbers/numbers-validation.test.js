const numbersValidationService = require('./numbers-validation.service');
const assert = require('assert');
const integers = {
  valid: [ 0, 1, -1, 999999, '-1', '1' ],
  invalid: [ 1.2, 'dasfa', '', '1.2', null, undefined, NaN ],
  validPositive: [ 1, 999999, '1' ],
  validNegative: [ -1, -9999999, '-2' ]
};
const floats = {
  valid: [ 0, 1, -1, 999999, '-1', '1', 1.2, -0.1, '9.1' ],
  invalid: [ 'dasfa', '', null, undefined, NaN ]
};

function validIntegers () {
  integers.valid.forEach(function (item) {
    assert(numbersValidationService.isInteger(item));
  });
}

function invalidIntegers () {
  integers.invalid.forEach(function (item) {
    assert(!numbersValidationService.isInteger(item));
  });
}

function validPositiveIntegers () {
  integers.validPositive.forEach(function (item) {
    assert(numbersValidationService.isPositiveInteger(item));
  });
}

function invalidPositiveIntegers () {
  integers.invalid.forEach(function (item) {
    assert(!numbersValidationService.isInteger(item));
  });
  integers.invalid.concat(integers.validNegative).forEach(function (item) {
    assert(!numbersValidationService.isPositiveInteger(item));
  });
}

function validFloat () {
  floats.valid.forEach(function (item) {
    assert(numbersValidationService.isFloat(item));
  });
}

function invalidFloats () {
  floats.invalid.forEach(function (item) {
    assert(!numbersValidationService.isFloat(item));
  });
}

describe('Testing services for validation of numbers', function () {
  it('Valid integers', validIntegers);
  it('Invalid integers', invalidIntegers);
  it('Valid positive integers', validPositiveIntegers);
  it('Invalid positive integers', invalidPositiveIntegers);
  it('Valid float', validFloat);
  it('Invalid float', invalidFloats);
});