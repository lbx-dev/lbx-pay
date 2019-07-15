const logger = require('app/common/log/logger.service');

const knex = require('knex');

const { memory: conf } = require('configuration/database/database-configuration.service');
const memory = knex(conf);

function setup() {

  async function transaction(t)  {
    const createSessionTableSQL = `
      CREATE TABLE IF NOT EXISTS session (
        session_id TEXT    PRIMARY KEY,
        user_id    TEXT CHECK( user_id != '' ),
        role_id    TEXT CHECK( role_id != '' ),
        role_name  TEXT CHECK( role_name != '' ),
        first_name TEXT CHECK( first_name != '' ),
        last_name  TEXT CHECK( last_name != '' ),
        email      TEXT CHECK( email  != '' ),
        expires    TEXT CHECK( expires != '' )
      );
      CREATE INDEX IF NOT EXISTS id_index ON session (user_id);
      CREATE INDEX IF NOT EXISTS email_index ON session (email);
    `;
    const createRestorationTAbleSQL = `
      CREATE TABLE IF NOT EXISTS restoration (
        restoration_token TEXT NOT NULL,
        CONSTRAINT _unique_rt UNIQUE (restoration_token) 
      );
    `;
    const createPartnerTableSQL = `
      CREATE TABLE IF NOT EXISTS partner (
        user_id    TEXT CHECK( user_id != '' ),
        partner_id    TEXT CHECK( user_id != '' ),
        name    TEXT CHECK( user_id != '' ),
        verified BOOLEAN DEFAULT false,
        PRIMARY KEY (user_id, partner_id),
        FOREIGN KEY(user_id) REFERENCES session(user_id)
       );
       CREATE INDEX IF NOT EXISTS uid_index ON partner (user_id);
       CREATE INDEX IF NOT EXISTS pid_index ON partner (partner_id);
    `;

    logger.info('Setting up session table and indices');
    await t.raw(createSessionTableSQL).transacting(t);

    logger.info('Setting up restoration table');
    await t.raw(createRestorationTAbleSQL).transacting(t);

    logger.info('Setting up partner table');
    await t.raw(createPartnerTableSQL).transacting(t);
  }

  return memory.transaction(transaction);
}


(async function() {
  logger.info('Setting up memory database');
  await setup();
  process.exit();
}());