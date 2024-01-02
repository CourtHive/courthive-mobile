// reads in any .env variables and add them to process.env
import dotenv from 'dotenv';
dotenv.config();

//General configuration
const RUNNING_ENVIRONMENT = process.env.NODE_ENV;

//Express configuration
const ENV_EXPRESS_SERVER_PORT = parseInt(process.env.TMX_SERVER_PORT);
const DEFAULT_EXPRESS_SERVER_PORT = 8833;
const ENV_EXPRESS_CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN;
const DEFAULT_EXPRESS_CORS_ALLOW_ORIGIN = '*';
const DEFAULT_EXPRESS_SERVER_BODY_PARSER_LIMIT = '2mb';

//Socket.io configuration
const SOCKET_IO_TMX_PATH = '/mobile';

const production = {
  socketIo: { tmx: SOCKET_IO_TMX_PATH },
  fileSystem: { cacheDir: './cache/' },
  app: {
    port: ENV_EXPRESS_SERVER_PORT || DEFAULT_EXPRESS_SERVER_PORT,
    corsAllowOrigin: ENV_EXPRESS_CORS_ALLOW_ORIGIN,
    bodyParser: { limit: DEFAULT_EXPRESS_SERVER_BODY_PARSER_LIMIT }
  }
};

const development = {
  socketIo: { tmx: SOCKET_IO_TMX_PATH },
  fileSystem: { cacheDir: './cache/' },
  app: {
    port: ENV_EXPRESS_SERVER_PORT || DEFAULT_EXPRESS_SERVER_PORT,
    corsAllowOrigin: ENV_EXPRESS_CORS_ALLOW_ORIGIN || DEFAULT_EXPRESS_CORS_ALLOW_ORIGIN,
    bodyParser: { limit: DEFAULT_EXPRESS_SERVER_BODY_PARSER_LIMIT }
  }
};

const test = {
  socketIo: { tmx: SOCKET_IO_TMX_PATH },
  fileSystem: { cacheDir: './cache/' },
  app: {
    port: ENV_EXPRESS_SERVER_PORT || DEFAULT_EXPRESS_SERVER_PORT,
    corsAllowOrigin: ENV_EXPRESS_CORS_ALLOW_ORIGIN || DEFAULT_EXPRESS_CORS_ALLOW_ORIGIN,
    bodyParser: { limit: DEFAULT_EXPRESS_SERVER_BODY_PARSER_LIMIT }
  }
};

const environments = {
  development,
  production,
  test
};

export const config = environments[RUNNING_ENVIRONMENT] || environments.production;

module.exports = config;
