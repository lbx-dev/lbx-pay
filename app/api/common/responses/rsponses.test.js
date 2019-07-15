const assert = require('assert');
const middleware = require('./responses.middleware');

const next = () => {};
const req = {
  headers: {},
  cookies: {}
};
const { constants } = require('app/api/common/constants/constants.service');
const validLanguages = Object.keys(require('app/api/common/responses/responses.service').responses);

function testNoLanguage() {
  middleware(req, null, next);
  assert.strictEqual(req.headers.language, constants.DEFAULT_LANGUAGE);
}
function testValidLanguages() {
  validLanguages.forEach((item) => {
    req.headers.language = item;
    middleware(req, null, next);

    assert.strictEqual(item, req.headers.language);
  });
}
function testInvalidLanguages() {
  req.headers.language = 'dsa';
  middleware(req, null, next);

  assert.strictEqual(req.headers.language, constants.DEFAULT_LANGUAGE);
}

describe('Testing responses service', function() {

  this.timeout(4002);

  it('Responses service - no language provided', testNoLanguage);
  it('Responses service - valid language provided', testValidLanguages);
  it('Responses service - invalid language provided', testInvalidLanguages);

});