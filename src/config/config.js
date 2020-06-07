const Joi = require('joi');
require('dotenv').config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  SERVER_PORT: Joi.number()
    .default(3000),
  MONGO_HOSTNAME: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  MONGO_DATABASE: Joi.string()
    .default("locations"),
  MONGO_AUTHSOURCE: Joi.string()
    .allow(null).default(null),
  MONGO_USERNAME: Joi.string().required()
    .description("username to connect to database"),
  MONGO_PASSWORD: Joi.string().required()
    .description("password to connect to database"),
  GOOGLE_API_KEY: Joi.string().required()
    .description("Google map api key to access google map")
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongo: {
    host: envVars.MONGO_HOSTNAME,
    port: envVars.MONGO_PORT,
    database: envVars.MONGO_DATABASE,
    user: envVars.MONGO_USERNAME,
    pass: envVars.MONGO_PASSWORD,
    authSource: envVars.MONGO_AUTHSOURCE
  },
  googleApiKey: envVars.GOOGLE_API_KEY
};

module.exports = config;
