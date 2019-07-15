const defaultConfig = require('./configuration');

function getConfiguration() {
  if(process.env.DATABASE_HOST) {
    defaultConfig.persistence.connection.host = process.env.DATABASE_HOST;
  }
  if(process.env.DATABASE_PORT) {
    defaultConfig.persistence.connection.port = process.env.DATABASE_PORT;
  }
  if(process.env.DATABASE_USER) {
    defaultConfig.persistence.connection.user = process.env.DATABASE_USER;
  }
  if(process.env.DATABASE_PASSWORD) {
    defaultConfig.persistence.connection.password = process.env.DATABASE_PASSWORD;
  }
  if(process.env.DATABASE_NAME) {
    defaultConfig.persistence.connection.database = process.env.DATABASE_NAME;
  }
  if(process.env.DATABASE_MIN_POOL) {
    defaultConfig.persistence.pool.min = process.env.DATABASE_MIN_POOL;
  }
  if(process.env.DATABASE_MAX_POOL) {
    defaultConfig.persistence.pool.max = process.env.DATABASE_MAX_POOL;
  }

  if(process.env.MEMORY_MIN_POOL) {
    defaultConfig.memory.pool.min = process.env.MEMORY_MIN_POOL;
  }
  if(process.env.MEMORY_MAX_POOL) {
    defaultConfig.memory.pool.max = process.env.MEMORY_MAX_POOL;
  }

  return defaultConfig;
}

module.exports = getConfiguration();