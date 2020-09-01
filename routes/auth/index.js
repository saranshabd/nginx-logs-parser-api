'use strict'

const { Router } = require('express')

const controllers = require('./controllers')
const { errorHandler } = require('../controllers')

const {
  InvalidEmailRequestError,
  InvalidPasswordRequestError
} = require('./errors')

const router = Router()

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    Bearer:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * path:
 *  /api/v1/auth/user/:
 *    post:
 *      summary: Authenticate a user using its email/password
 *      tags: [User Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *            example:
 *              email: saranshabd@gmail.com
 *              password: L;xl5zsG
 *      responses:
 *        200:
 *          description: User authenticated successfully
 *          headers:
 *            Authentication:
 *              type: string
 *              description: Authentication token of the logged in user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *              example:
 *                message: user authenticated successfully
 *        400:
 *          description: Invalid user credentials passed
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *              example:
 *                message: invalid user credentials
 */
router.post('/user/', errorHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !controllers.validateEmail(email)) {
    throw new InvalidEmailRequestError()
  }
  if (!password) {
    throw new InvalidPasswordRequestError()
  }
  const jwtToken = await controllers.authenticateUser(email.toLowerCase(), password)
  res.setHeader('Authorization', `Bearer ${jwtToken}`)
  res.status(200).json({
    message: 'user authenticated successfully'
  })
}))

module.exports = router
