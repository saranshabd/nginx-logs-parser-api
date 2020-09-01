'use strict'

const authController = require('../controllers/authentication')

async function authMiddleware(req, res, next) {
  const authToken = req.get('Authorization')
  if (!authToken || '' === authToken) {
    return res.status(403).send()
  }
  const authTokenArr = authToken.split(' ')
  if (2 !== authTokenArr.length || 'Bearer' !== authTokenArr[0]) {
    return res.status(403).send()
  }
  const jwtToken = authTokenArr[1]
  if (!authController.validateUserIdToken(jwtToken)) {
    return res.status(403).send()
  }
  next()
}

module.exports = {
  authMiddleware,
}
