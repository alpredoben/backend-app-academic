const httpStatus = require('http-status')
const { ApiError } = require('../utils/api-error')
const { config } = require('../config/index')
const logger = require('../middlewares/logger')

exports.errorConverter = (err, req, res, next) => {
  let tmpError = err;
  if (!(tmpError instanceof ApiError)) {
    const statusCode = tmpError.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    const message = tmpError.message || httpStatus[statusCode];
    tmpError = new ApiError(statusCode, message, false, err.stack)
  }

  next(tmpError)
}

exports.errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  }

  if (config.env === 'development') {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}