const assert = require('assert');
const http = require('axios');
const databaseService = require('app/database/database.service');
const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;

const { USER, LOGIN_DETAILS, DUMMY_TOKEN } = require('integration/common/data');

async function registerUser() {
  const { persistence: database } = databaseService.get();
  const { rows } = await database.raw('SELECT id AS "roleId" FROM "public"."role" WHERE "name" = \'user\';');

  USER.roleId = rows[0].roleId;

  const { status } = await http.post('http://localhost:3010/api/registration', USER);

  assert.strictEqual(status, httpStatus.CREATED);
}

async function registerUserAgain() {
  try {
    const { persistence: database } = databaseService.get();
    const { rows } = await database.raw('SELECT id AS "roleId" FROM "public"."role" WHERE "name" = \'user\';');

    USER.roleId = rows[0].roleId;

    const { status } = await http.post('http://localhost:3010/api/registration', USER);
    assert.notStrictEqual(status, httpStatus.CREATED);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.CONFLICT);
  }
}

async function registerUserAgainRandomCapitalCharacters() {
  try {
    const { persistence: database } = databaseService.get();
    const { rows } = await database.raw('SELECT id AS "roleId" FROM "public"."role" WHERE "name" = \'user\';');

    USER.roleId = rows[0].roleId;
    USER.email = USER.email.split('').map(char => {
      if(Math.random() > 0.5) {
        return char.toLocaleUpperCase();
      }
      return char;
    }).join('');

    const { status } = await http.post('http://localhost:3010/api/registration', USER);

    assert.notStrictEqual(status, httpStatus.CREATED);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.CONFLICT);
  }
}

async function loginFailedUnconfirmed() {
  try {
    const { status } = await http.post('http://localhost:3010/api/login', LOGIN_DETAILS);
    assert.notStrictEqual(status, httpStatus.OK);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.FORBIDDEN);
  }
}

async function confirmationFailsNoToken() {
  try {
    const { status } = await http.post('http://localhost:3010/api/confirm');
    assert.notStrictEqual(status, httpStatus.OK);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.BAD_REQUEST);
  }
}

async function confirmationFailsNoUser() {
  try {
    const { status } = await http.post('http://localhost:3010/api/confirm', { confirmationToken: DUMMY_TOKEN });

    assert.notStrictEqual(status, httpStatus.OK);
  } catch({ response }) {
    assert.strictEqual(response.status, httpStatus.NOT_FOUND);
  }
}

async function confirmUser() {
  const { persistence: database } = databaseService.get();

  USER.email = USER.email.toLocaleLowerCase();

  const sql = `
    SELECT
      user_id,
      confirmation_token 
    FROM
      "public"."security" 
    WHERE user_id = (
      SELECT id FROM "public"."user" WHERE email = ?
    );
  `;
  const { rows } = await database.raw(sql, USER.email);
  const confirmationToken = rows[0].confirmation_token;

  USER.id = rows[0].user_id;

  const { status } = await http.post('http://localhost:3010/api/confirm', { confirmationToken });
  assert.strictEqual(status, httpStatus.OK);

}

async function scenario() {

  describe('Testing registration scenarios', function registrationScenario() {

    it('Successful registration', registerUser);
    it('Duplicate user registration failure', registerUserAgain);
    it('Duplicate user registration failure - random capital characters', registerUserAgainRandomCapitalCharacters);
    it('Unconfirmed user login failure', loginFailedUnconfirmed);
    it('Bad confirmation request', confirmationFailsNoToken);
    it('Confirmation of non existent token', confirmationFailsNoUser);
    it('Confirm registered user', confirmUser);

  });
}

module.exports = {
  scenario
};