'use strict'

const authController = require('../../controllers/authentication')

const { InvalidUserCredentialsRequestError } = require('./errors')

/**
 * Validates format of the given email address
 * 
 * @param {string} email 
 * 
 * @returns {boolean}
 */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Authenticates user with given credentials and returns authentication token
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {string}
 */
async function authenticateUser(email, password) {
  try {
    const data = await authController.authenticateUser(email, password)
    return data['idToken']['jwtToken']
  } catch (_) {
    throw new InvalidUserCredentialsRequestError()
  }
}

module.exports = {
  validateEmail,
  authenticateUser,
}
