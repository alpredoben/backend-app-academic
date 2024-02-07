const morgan = require('morgan')
const { config } = require('../config/index')
const logger = require('./logger')

morgan.token('message', (_req, res) => res.locals.errorMessage || '')

const getIpFormat = () => {
  return config.env === 'production' ? ':remote-addr - ' : ''
}

exports.successHandler = morgan(
  `${getIpFormat()}:method :url :status ==> :response-time ms - message: :message`,
  {
    skip: (req, res) => res.statusCode >= 400,
    stream: {
      write: (message) => {
        logger.info(message.trim())
      }
    }
  }
)

exports.errorHandler = morgan(
  `${getIpFormat()}:method :url :status - :response-time ms`,
  {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (message) => {
        logger.error(message.trim())
      }
    }
  }
)