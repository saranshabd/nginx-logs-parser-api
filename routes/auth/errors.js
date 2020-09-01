'use strict'

const { BaseRequestError } = require('../errors')

class InvalidEmailRequestError extends BaseRequestError {
  constructor(message='invalid email') {
    super(message, 400, true)
    this.message = message
  }
}

class InvalidPasswordRequestError extends BaseRequestError {
  constructor(message='invalid password') {
    super(message, 400, true)
    this.message = message
  }
}

class InvalidUserCredentialsRequestError extends BaseRequestError {
  constructor(message='invalid user credentials') {
    super(message, 400, true)
    this.message = message
  }
}

module.exports = {
  InvalidEmailRequestError,
  InvalidPasswordRequestError,
  InvalidUserCredentialsRequestError,
}
