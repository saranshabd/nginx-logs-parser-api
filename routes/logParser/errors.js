'use strict'

const { BaseRequestError } = require('../errors')

class InvalidFilterTypeRequestError extends BaseRequestError {
  constructor(message='invalid filter type') {
    super(message, 400, true)
    this.message = message
  }
}

class InvalidConditionValueRequestError extends BaseRequestError {
  constructor(message='invalid condition value') {
    super(message, 400, true)
    this.message = message
  }
}

class InvalidConditionRangeRequestError extends BaseRequestError {
  constructor(message='invalid condition range') {
    super(message, 400, true)
    this.message = message
  }
}

module.exports = {
  InvalidFilterTypeRequestError,
  InvalidConditionValueRequestError,
  InvalidConditionRangeRequestError,
}
