const assert = require('assert');
const http = require('axios');
const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;
const { USER } = require('integration/common/data');

async function getRolesUnauthorized() {
  try{
    const { status } = await http.get('http://localhost:3010/api/roles');

    assert.notStrictEqual(status, httpStatus.OK);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.UNAUTHORIZED);
  }
}
async function fetchRoles() {
  const { status } = await http.get('http://localhost:3010/api/roles', { headers: { 'ks-security': USER['ks-security'] } });

  assert.strictEqual(status, httpStatus.OK);
}

async function scenario() {
  describe('Testing roles scenario', function rolesScenario() {
    it('Fetching roles - unauthorized', getRolesUnauthorized);
    it('Fetching roles - success', fetchRoles);
  });
}

module.exports = { scenario };