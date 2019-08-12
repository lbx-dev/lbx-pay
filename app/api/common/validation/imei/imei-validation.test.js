const imeiValidationService = require('./imei-validation.service');
const assert = require('assert');
const IMEI = {
  valid: [
    '490154203237518',
    '353048099964431'
  ],
  invalid: [
    490154203237518,
    'dsa',
    '1234567890123413',
    '12345678901234a',
    '231421512351233'
  ]
};

function valid() {
  IMEI.valid.forEach(function(item) {
    assert(imeiValidationService.isValid(item));
  });
}

function invalid() {
  IMEI.invalid.forEach(function(item) {
    assert(!imeiValidationService.isValid(item));
  });
}

describe('Testing services for validation of IMEI numbers', function() {
  it('Valid IMEI', valid);
  it('Invalid IMEI', invalid);
});