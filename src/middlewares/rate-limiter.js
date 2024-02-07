const { rateLimit } = require('express-rate-limit')
const { config } = require('../config/index')

exports.authLimit = rateLimit({
  windowMs: config.timeLimiter,
  max: 20,
  skipSuccessfulRequests: true
})