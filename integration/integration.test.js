const { scenario: healthTestsScenarios } = require('./health/health.test');
const { scenario: authorizationScenarios } = require('./authorization/authorization.test');
const { scenario: rolesScenario } = require('./roles/roles.test');

const knex = require('knex');
const databaseConfiguration = require('configuration/database/database-configuration.service');
const persistence = knex(databaseConfiguration.persistence);
const memory = knex(databaseConfiguration.memory);
const database = {
  persistence,
  memory
};
const databaseService = require('app/database/database.service');
databaseService.inject(database);

describe('INTEGRATION TEST', function integrationTest() {
  this.timeout(0);

  healthTestsScenarios();

  authorizationScenarios();
  rolesScenario();
});
