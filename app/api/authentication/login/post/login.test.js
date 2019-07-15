const service = require('./login.service');
const assert = require('assert');
const validLogins = [ {
  email: 'test@test.com',
  password: '213'
} ];
const invalidLogins = [ {
  email: 'i2uyDoI585OXHVOz2OgAdZ7UzmozSOPdsagfasgag',
  password: '213'
}, {
  email: 'abc',
  password: '213'
}, {
  email: 'i2uyDdasfgas'
}, {} ];

function validLoginsTest() {
  validLogins.forEach(function(login) {
    assert(!service.validateCall(login, 'rs'));
  });
}
function invalidLoginsTest() {
  invalidLogins.forEach(function(login) {
    assert(service.validateCall(login, 'rs').code === 400);
  });
}

describe('Testing login service', function() {

  it('Login service validation - valid logins', validLoginsTest);
  it('Login service - invalid logins', invalidLoginsTest);

});