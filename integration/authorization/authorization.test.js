const { scenario: registrationScenario } = require('./registration/registration.test');
const { scenario: loginScenario } = require('./login/login.test');
const { scenario: passwordRestorationScenario } = require('./restore-forgot-password/restore-forgot-password.test');

function scenario() {
  describe('Testing authorization scenarios', function authorizationScenario() {

    this.timeout(0);

    registrationScenario();
    loginScenario();
    passwordRestorationScenario();

  });
}

module.exports = {
  scenario
};