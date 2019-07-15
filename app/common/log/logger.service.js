const { environment } = require('app/common/environment/environment.service');
const dailyRotate = require('winston-daily-rotate-file');
const transportsArray = [];


const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, printf, colorize, json } = format;

let logger;

transports.DailyRotateFile = dailyRotate;

const fileFormatter = printf(message => {
  if(typeof message.message === 'object') {
    message.message = JSON.stringify(message.message);
  }
  return `
************************************************************************************************************************
${message.level.toUpperCase()} \t ${message.message}`;
});

const consoleLogFormatter = printf((message) => {
  if(typeof message.message === 'object') {
    message.message = JSON.stringify(message.message);
  }
  return `${message.level}: ${message.message}`;
});

function createTransports() {
  const productionTransport = new transports.DailyRotateFile({
    name: 'production-log',
    datePattern: 'YYYY-MM-DD',
    prepend: true,
    level: 'warn',
    filename: __dirname + '/logs/%DATE%.log.txt',
    handleExceptions: true,
    format: combine(
      timestamp(),
      prettyPrint(),
      fileFormatter
    ),
    maxsize: 5242880
  });
  const stagingTransport = new transports.DailyRotateFile({
    name: 'staging-log',
    datePattern: 'YYYY-MM-DD',
    prepend: true,
    level: 'info',
    filename: __dirname + '/logs/%DATE%.log.txt',
    handleExceptions: true,
    timestamp: function () {
      return new Date();
    },
    format: combine(
      json(),
      timestamp(),
      prettyPrint(),
      fileFormatter
    ),
    prettyPrint: true,
    maxsize: 5242880,
    colorize: false
  });
  const consoleTransport = new transports.Console({
    level: 'debug',
    handleExceptions: true,
    format: combine(
      colorize(),
      timestamp(),
      consoleLogFormatter
    )
  });

  if (environment === 'development') {
    transportsArray.push(stagingTransport);
    transportsArray.push(consoleTransport);
  } else if (process.env.INTEGRATION_TESTING) {
    transportsArray.push(stagingTransport);
    transportsArray.push(consoleTransport);
  } else if (environment === 'staging') {
    transportsArray.push(stagingTransport);
  } else if (environment === 'production') {
    transportsArray.push(productionTransport);
  } else {
    transportsArray.push(stagingTransport);
    transportsArray.push(consoleTransport);
  }
}

function getInstance() {
  if (!logger) {
    createTransports();
    logger = createLogger({
      transports: transportsArray,
      exitOnError: false
    });
  }

  process.on('unhandledRejection', (reason) => {
    logger.log({ level: 'error', message: 'Server Failed' });
    logger.log({ level: 'error', message: 'Unhandled Rejection at: ' + reason.stack || reason });

    if(process.env.INTEGRATION_TESTING) {
      process.exit(2);
    }
  });
  return logger;
}

module.exports = getInstance();
