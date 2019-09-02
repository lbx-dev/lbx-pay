/* eslint-disable global-require */
const express = require('express');
const logger = require('app/common/log/logger.service');

const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bluebird = require('bluebird');
const security = require('app/api/authentication/security/security.middleware');
const responses = require('app/api/common/responses/responses.middleware');
const { composeEmail, sendEmail } = require('app/api/common/responses/responses.service');

const constantsService = require('app/api/common/constants/constants.service');

const environment = require('app/common/environment/environment.service').environment;

global.Promise = bluebird;

const payService = require('app/api/common/pay/LBXPay');
const cron = require('node-cron');

class Server {
  constructor() {
    this.connections = [];
    this.app = express();

    this.connectionClose = this.connectionClose.bind(this);
    this.connectionEstablished = this.connectionEstablished.bind(this);
    this.stopServer = this.stopServer.bind(this);
    this.startServer = this.startServer.bind(this);
    this.includeMiddlewares = this.includeMiddlewares.bind(this);

  }

  connectionClose(closed) {
    this.connections = this.connections.filter(function (current) {
      return (current !== closed);
    });
  }
  connectionEstablished(connection) {
    connection.on('close', this.connectionClose);
    this.connections.push(connection);
  }
  stopServer(callback) {
    logger.info('Stopping server');

    if(this.server) {
      this.server.close(callback);
    }
    this.connections.forEach(function (connection) {
      connection.end();
      connection.destroy();
    });

    if(!this.server){
      return callback();
    }

  }

  includeDocumentationRoute() {
    if(environment === 'development') {
      this.app.use('/documentation/', serveStatic('documentation'));
    }
  }
  includeAPIRoutes() {
    logger.info('Including API routes');

    require('app/api/health/get/health.route')(this.app);
    require('app/api/authentication/login/post/login.route')(this.app);
    require('app/api/authentication/registration/post/new-user/registration.route')(this.app);
    require('app/api/authentication/registration/post/confirm-registration/registration.route')(this.app);
    require('app/api/authentication/forgot-password/post/forgot-password.route')(this.app);
    require('app/api/authentication/restore-password/get/by-id/restore-password.route')(this.app);
    require('app/api/authentication/restore-password/post/restore/restore-password.route')(this.app);
    require('app/api/roles/get/all/roles.route')(this.app);
    require('app/api/categories/get/all/categories.route')(this.app);
    require('app/api/pay/get/balance/pay.route')(this.app);
    require('app/api/pay/get/growth-bonds/pay.route')(this.app);

    require('app/api/pay/post/deposit/pay.route')(this.app);
  }
  includeMiddlewares() {
    logger.info('Including middlewares');

    this.app.use('/api/*', bodyParser.urlencoded({ extended: true, limit: '20kb' }));
    this.app.use('/api/*', bodyParser.json({ limit: '20kb' }));

    this.app.use(cookieParser());
    this.app.use('/api/*', responses);
    this.app.use('*', security());
  }
  includeViewRoutes(nuxt) {
    logger.info('Including view application');
    if(nuxt) {
      this.app.use(nuxt.render);
    }
  }

  async initializeServer(nuxt) {
    this.app.set('port', 3010);

    await constantsService.populate();

    this.includeMiddlewares();
    this.includeAPIRoutes();
    this.includeDocumentationRoute();
    this.includeViewRoutes(nuxt);

  }
  async startServer() {
    logger.info('Starting server');
    this.server = this.app.listen(this.app.get('port'));

    this.server.on('connection', this.connectionEstablished);
    logger.info('Server started');
    if(typeof process.send === 'function'){
      process.send({ prepared: true, pid: process.pid } );
    }

    cron.schedule('30 20 2 * *', async () => {
      try{
        const clearing = await payService.clearing(environment === 'development');
        if(clearing.error) {
          await sendEmail(composeEmail.CLEARING_NOTIFICATION(false, clearing.receipt, clearing.cause));
        } else {
          await sendEmail(composeEmail.CLEARING_NOTIFICATION(true, clearing));
        }
      } catch(error) {
        await sendEmail(composeEmail.CLEARING_NOTIFICATION(false, 'Details unavailable', error.cause));
        logger.log({ level: 'error', message: error });
      }
    });

  }

}

module.exports = Server;