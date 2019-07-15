const rimraf = require('rimraf');

const logger = require('app/common/log/logger.service');
const databaseConfiguration = require('configuration/database/database-configuration.service');
const knex = require('knex');
const persistence = knex(databaseConfiguration.persistence);

const { DELETE_SCHEMA, CREATE_SCHEMA, CLEAR_DATABASE, ROLES_EXISTS, INSERT_ROLES, INSERT_ADMINISTRATOR, INSERT_USER, INSERT_COUNTRIES } = require('./sql/seeding.sql');

function clearLegal() {
  rimraf.sync(__dirname + '/../../legal/partners/*');
}

async function deleteSchema(shallExit) {
  logger.info('Purging schema and recreating');

  async function transaction(t) {
    await t.raw(DELETE_SCHEMA);
    logger.info('Successful purge');
    await t.raw(CREATE_SCHEMA);
    logger.info('Successful re-creation');
  }

  await persistence.transaction(transaction);
  if(shallExit) {
    process.exit();
  }
}

async function emptyDatabase(shallExit) {
  clearLegal();
  try {
    await persistence.raw(CLEAR_DATABASE);
    logger.info('Successful clearing');
    if(shallExit) {
      process.exit();
    }
  } catch(error) {
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error });
    process.exit(-1);
  }
}

async function seedInitial() {
  await emptyDatabase();

  async function transaction(t) {
    const { rows: rolesCountRows } = await t.raw(ROLES_EXISTS);

    if(Number(rolesCountRows[0].count) === 0) {
      await t.raw(INSERT_ROLES);
    }
    await t.raw(INSERT_ADMINISTRATOR);
    await t.raw(INSERT_USER);
  }

  try {
    await persistence.transaction(transaction);
    logger.info('Successful seeding');
    process.exit();
  } catch(error) {
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error });

    process.exit(error);
  }
}

switch(process.argv[2]) {
  case 'purge':
    deleteSchema(true);
    break;
  case 'clear':
    emptyDatabase(true);
    break;
  case 'initial':
    seedInitial();
    break;
  case 'staging':
    seedInitial();
    break;
  default:
    logger.warn('Available options');
    logger.warn('clear');
    logger.warn('initial');
    logger.warn('staging');
}