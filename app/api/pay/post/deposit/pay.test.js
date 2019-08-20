const service = require('./pay.service');

const bodies = {
  invalid: [ {
    amount: '1111111111',
    bondId: '0e6a7881-1560-4c57-8257-37d6facfdd64dsfasgfagas'
  }, {
    amount: '11111111111111',
    bondId: '0e6a7881-1560-4c57-8257-37d6facfdd64'
  }, {
    amount: '1232%47^32',
    bondId: '0e6a7881-1560-4c57-8257-37d6facfdd64'
  }, {
    amount: '1245435',
    bondId: '0e6a7881-1560-4c57-8257-37d6facfdd64',
    a: 'sda'
  } ],
  valid: [ {
    bondId: '0e6a7881-1560-4c57-8257-37d6facfdd64'
  }, {
    amount: '1111111111',
    bondId: '0e6a7881-1560-4c57-8257-37d6facfdd64'
  } ]
};
const assert = require('assert');

function validBodies() {
  bodies.valid.forEach(function(item) {
    assert(!service.validateCall(item));
  });
}

function invalidStrings() {
  bodies.invalid.forEach(function(item) {
    assert.strictEqual(service.validateCall(item, 'rs').code, 400);
  });
}

describe('Testing deposit validation', function() {

  it('Valid bodies', validBodies);
  it('Invalid bodies', invalidStrings);

});