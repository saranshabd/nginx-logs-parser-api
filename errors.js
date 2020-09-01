'use strict'

class NotImplementedError extends Error {
  constructor(message='Module not implemented') {
    super(message)
  }
}

class BaseRequestError extends Error {
  constructor(message, httpStatus, isWarning=false) {
    super(message)
    if (BaseRequestError === this.constructor) {
      throw new NotImplementedError
    }
    this.isWarning = isWarning
    this.httpStatus = httpStatus
  }

  setResponse = (res) => {
    res.status(this.httpStatus).json({ message: this.message })
  }
}

module.exports = {
  NotImplementedError,
  BaseRequestError,
}
