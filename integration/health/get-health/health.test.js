const assert = require('assert');
const http = require('axios');
const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;

async function getHealth() {
  const { status } = await http.get('http://localhost:3010/api/health');

  assert.strictEqual(status, httpStatus.OK);
}

async function scenario() {

  it('Checking health', getHealth);

}

module.exports = { scenario };