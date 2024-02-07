const { expressjwt: jwtExpress } = require('express-jwt')
const config = require('./environments')

const isRevoked = async (_req, _payload, done) => {
  done()
}

const jwtAuth = () => {
  return jwtExpress({
    secret: config.jwt.secret,
    getToken: function headerOrQueryString(req) {
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.query.token
      if (token) {
        return token;
      }
      return null
    },
    algorithms: ['HS256'],
    isRevoked
  }).unless({
    path: [
      // public routes that don't require authentication
      /\/v[1-9](\d)*\/(auth|docs)\/.*/
    ]
  })
}

module.exports = jwtAuth