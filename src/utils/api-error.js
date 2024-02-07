class ApiError extends Error {
  constructor(code, msg, isOperational = true, stack = '') {
    super(msg)
    this.statusCode = code;
    this.isOperational = isOperational
    if (stack) {
      this.stack = stack
    }
    else {
      Error.captureStackTrace(this, this.constructor)
    }

  }
}

module.exports = { ApiError }