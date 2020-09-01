'use strict'

const { BaseRequestError } = require('./errors')

function errorHandler(fn) {
  return async (req, res) => {
    try {
      await fn(req, res)
    } catch (err) {
      if (err instanceof BaseRequestError) {
        err.isWarning ? console.log(err.message) : console.log(err)
        return err.setResponse(res)
      }
      console.log(err)
      res.status(500).json({
        message: 'internal server error'
      })
    }
  }
}

module.exports = {
  errorHandler,
}
