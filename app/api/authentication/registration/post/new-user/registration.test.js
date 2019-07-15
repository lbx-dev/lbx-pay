const registrationService = require('./registration.service');
const assert = require('assert');
const passwords = [
  'a',
  'dfg325239jiovfnfk2iogdvjmjkhiru2312pofnvsds',
  'aggfsafajifsnv riqu4kr nbivu5q  uiviuo 4uv4quifbiur8596uhbyvjnu5u sdnaaf ,.,v.,..<,w vbybayrby  giuhafv '
];
const invalidBodies = [ {
  firstName: '',
  lastName: '',
  email: '',
  roleId: ''
}, {
  firstName: 'a',
  email: 'a@aa.com',
  roleId: 'a'
}, {
  lastName: 'a',
  email: 'a@aa.com',
  roleId: 'a'
}, {
  firstName: 'a',
  lastName: 'a',
  roleId: 'a'
}, {
  firstName: '1',
  lastName: '2',
  email: 'a@aa.com'
}, {
  firstName: 'vdizeuquskpdtykfnpqicmsaexxavhxwajuakumikfaurgdbfbfxkcnskyjgamaanedoiboxnkubstgvkzomedicchmktyhvuobzjjgptwtkuvtcpebnzdazebrullbmi',
  lastName: 'a',
  email: 'a@aa.com',
  roleId: 'a'
}, {
  firstName: 'a',
  lastName: 'vdizeuquskpdtykfnpqicmsaexxavhxwajuakumikfaurgdbfbfxkcnskyjgamaanedoiboxnkubstgvkzomedicchmktyhvuobzjjgptwtkuvtcpebnzdazebrullbmi',
  email: 'a@aa.com',
  roleId: 'a'
}, {
  firstName: 'a',
  lastName: 'a',
  email: 'dsacom',
  roleId: 'a'
}, {
  firstName: 'a',
  lastName: 'a',
  email: 'a@aa.com',
  roleId: 'ftdtgjtqimmerjfqtvlqaavqhesrmjuyh'
}, {
  firstName: 'a',
  lastName: 'a',
  email: 'a@aa.com',
  roleId: 'ftdtgjtqimmerjfqtvlqaavqhesrm'
}, {

} ];


function validationServiceNoToken() {
  invalidBodies.forEach(function (item) {
    const response = registrationService.validateCall(item, 'rs');
    assert(response && response.code === 400);
  });
}
function passwordHashing(done) {
  passwords.forEach(function (item, index) {
    const hashedPassword = registrationService.createHashedPassword(item);
    setTimeout(function () {
      assert(hashedPassword, registrationService.createHashedPassword(item));
      if(index === (passwords.length -1)) {
        done();
      }
    }, Math.floor(Math.random() * 1000) + 1);
  });
}
describe('Testing registration service', function() {

  this.timeout(4002);

  it('Registration service validation - invalid call', validationServiceNoToken);
  it('Registration service - password hashing', passwordHashing);

});