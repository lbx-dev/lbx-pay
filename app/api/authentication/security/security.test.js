const service = require('./security.service');
const assert = require('assert');


function validationServiceNoToken() {
  const response = service.validate(null, 'rs');
  assert(response.code === 400);
}
describe('Testing security middleware', function() {

  it('Validation service - no token', validationServiceNoToken);

});