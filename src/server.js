const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const httpStatus = require('http-status');
const { jwtAuth, config } = require('./config/index')
const { successHandler, errorHandler } = require('./middlewares/handlers');
const { authLimit } = require('./middlewares/rate-limiter')
const { errorConverter, errorMiddleware } = require('./middlewares/error')
const { ApiError } = require('./utils/api-error')

const app = express();

if (config.env !== 'test') {
  app.use(successHandler)
  app.use(errorHandler)
}

// Set Security HTTP headers
app.use(helmet())

// Parse JSON Request Body
app.use(express.json())

// Parse Urlencoded Request Body
app.use(express.urlencoded({ extended: true }))

// Sanitize Request Data
app.use(xss())

// gzip Compression
app.use(compression())

// Enable Cors
app.use(cors())
app.options('*', cors())

// Set Cookie Parser
app.use(cookieParser())

// Set JWT Authentication
app.use(jwtAuth())

// Connect To Database


// Limit Repeated Failed Request To Auth Endpoint
if (config.env === 'production') {
  app.use('/v1/auth', authLimit)
}

// Api Routes
// app.use('v1', routes)

// Send Back 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'))
})

// Convert error to API Error, If Needed
app.use(errorConverter)

// Handler error
app.use(errorMiddleware)

module.exports = app;

