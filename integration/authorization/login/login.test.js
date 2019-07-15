const assert = require('assert');
const http = require('axios');

const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;

const { USER, INVALID_LOGIN_DETAILS, LOGIN_DETAILS } = require('integration/common/data');

async function unsuccessfulLogin() {
  try {
    const { status } = await http.post('http://localhost:3010/api/login', INVALID_LOGIN_DETAILS);
    assert.notStrictEqual(status, httpStatus.OK);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.NOT_FOUND);
  }
}

async function successfullLogin() {
  const { status, data } = await http.post('http://localhost:3010/api/login', LOGIN_DETAILS);
  assert(!data.user.partner);
  assert.strictEqual(status, httpStatus.OK);
  USER['ks-security'] = data['ks-security'];
}

async function successfullLoginRandomCapitalCharacters() {
  LOGIN_DETAILS.email = LOGIN_DETAILS.email.split('').map(char => {
    if(Math.random() > 0.5) {
      return char.toLocaleUpperCase();
    }
    return char;
  }).join('');

  const { status, data } = await http.post('http://localhost:3010/api/login', LOGIN_DETAILS);
  LOGIN_DETAILS.email = LOGIN_DETAILS.email.toLocaleLowerCase();

  USER['ks-security'] = data['ks-security'];

  assert.strictEqual(status, httpStatus.OK);

}

function scenario() {
  describe('Testing login scenario', function loginScenario() {

    it('Invalid login details', unsuccessfulLogin);
    it('Successful login - partner is non existent', successfullLogin);
    it('Successful login - random capital characters', successfullLoginRandomCapitalCharacters);

  });
}

module.exports = { scenario };