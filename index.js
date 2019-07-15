/* eslint-disable global-require */
const { environment } = require('app/common/environment/environment.service');
const logger = require('app/common/log/logger.service.js');
const hotReloadSevice = require('hot-reload/hot-reload.service');
const Cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const { startIntegrationTest } = require('integration/integration.service');

const knex = require('knex');
const databaseConfiguration = require('configuration/database/database-configuration.service');
const persistence = knex(databaseConfiguration.persistence);
const memory = knex(databaseConfiguration.memory);
const database = { persistence, memory };
let databaseService;
let timer = null;

let Server;
let server;
let clusterReady = 0;

const { Nuxt, Builder } = require('nuxt');
let nuxt;
let nuxtOptions;

async function buildFrontEnd() {
  logger.info('Building front end');

  nuxtOptions = require('./app/view/nuxt.config.js');
  nuxtOptions.dev = (environment === 'development');

  nuxt = new Nuxt(nuxtOptions);

  if(nuxtOptions.dev) {
    await new Builder(nuxt).build();
  }
}

async function startServer(buildNuxt) {
  logger.info('Starting server');

  Server = require('app/Server');
  server = new Server();

  logger.info('Injecting the database connections');
  databaseService = require('app/database/database.service');
  databaseService.inject(database);

  try {
    timer = null;

    if(!process.env.INTEGRATION_TESTING && buildNuxt) {
      nuxt = null;
      await buildFrontEnd();
    }
    await server.initializeServer(nuxt);
    server.startServer();
  } catch(error) {
    logger.error('Server runtime error!');
    logger.log({ level: 'error', message: error.message });
  }

}

async function stopServer(buildNuxt) {
  if(server) {
    server.stopServer((error) => {
      if(error) {
        logger.error('Error stopping server. Exiting with error');
        logger.log({ level: 'error', message: error });

        process.exit(-1);
      }

      Server = null;
      databaseService = null;
      hotReloadSevice.clearMemory();

      logger.info('Server stopped. Restarting');
      startServer(buildNuxt);
    });
  }
}

async function startCluster() {
  if(Cluster.isMaster) {
    if(!process.env.INTEGRATION_TESTING) {
      await buildFrontEnd();
    }

    for(let i = 0; i < numCPUs; i++) {
      Cluster.fork();
    }
    Object.entries(Cluster.workers).forEach(worker => worker[1].on('message', (message) => {
      if(message.prepared) {
        clusterReady += 1;
      }
      if(clusterReady === numCPUs) {
        if(process.env.INTEGRATION_TESTING) {
          return startIntegrationTest();
        }
      }
    }));
    return;
  }
  startServer(true);
}

function restartServer(buildNuxt) {
  logger.info('Project updated');
  if(timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(stopServer, 100, buildNuxt);
}

(function start() {
  logger.info('First time starting');
  if(environment === 'development') {
    hotReloadSevice.subscribe(restartServer);
    return startServer(true);
  }
  startCluster();
})();