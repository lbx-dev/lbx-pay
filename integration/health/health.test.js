const { scenario: healthScenario } = require('./get-health/health.test');

function scenario() {
  describe('Testing health of the application', function healthScenarios() {

    this.timeout(0);

    healthScenario();

  });
}
module.exports = {
  scenario
};