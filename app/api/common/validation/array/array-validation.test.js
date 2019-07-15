const arrayValidationService = require('./array-validation.service');
const assert = require('assert');
const validArrays = [
    [], [ 1, 2, 'a', Array.prototype ]
  ],
  invalidArrays = [
    {}, 'a', 123, -2, '[]', '[1, 2]'
  ];

function validArraysTest() {
  validArrays.forEach(function (item) {
    assert(arrayValidationService.isArray(item));
  });
}
function invalidArraysTest() {
  invalidArrays.forEach(function (item) {
    assert(!arrayValidationService.isArray(item));
  });
}

describe('Testing services for validation of arrays', function() {
  it('Valid arrays', validArraysTest);
  it('Invalid arrays', invalidArraysTest);
});