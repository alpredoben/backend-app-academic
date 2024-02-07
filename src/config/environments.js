const dotenv = require('dotenv');
const path = require('path')
const Joi = require('@hapi/joi')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const objEnv = {
  APP_NAME: Joi.string().default('Backend-Academic'),
  APP_ENV: Joi.string().valid('production', 'development', 'test', 'staging').required(),
  APP_PORT: Joi.number().default('3000'),

  JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('How minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Total days after which refresh tokens expire'),

  COOKIE_EXPIRATION_HOURS: Joi.number().default(24).description('Total hours after which httpOnly cookie expire'),

  DB_HOST: Joi.string().required().description('Database hostname'),
  DB_PORT: Joi.number().required().default(5432).description('Database port'),
  DB_USER: Joi.string().required().description('Database username'),
  DB_PASS: Joi.string().required().description('Database password'),
  DB_NAME: Joi.string().required().description('Database name'),

  AUTH_LIMITER: Joi.number().required().default(15 * 60 * 1000)
}

const { value: cfgValue, error: cfgError } = Joi.object()
  .keys(objEnv)
  .unknown()
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (cfgError) {
  throw new Error(`Config validation error : ${cfgError.message}`)
}

module.exports = {
  env: cfgValue.APP_ENV,
  port: cfgValue.APP_PORT,
  appName: cfgValue.APP_NAME,

  jwt: {
    secret: cfgValue.JWT_SECRET,
    accessExpired: cfgValue.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpired: cfgValue.JWT_REFRESH_EXPIRATION_DAYS,
    resetExpired: 10,
  },

  cookie: {
    expiredHours: cfgValue.COOKIE_EXPIRATION_HOURS
  },

  database: {
    user: cfgValue.DB_USER,
    password: cfgValue.DB_PASS,
    hostname: cfgValue.DB_HOST,
    port: cfgValue.DB_PORT,
    database: cfgValue.DB_NAME
  },

  timeLimiter: cfgValue.AUTH_LIMITER
}

