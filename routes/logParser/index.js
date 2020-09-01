'use strict'

const { Router } = require('express')

const controllers = require('./controllers')
const { errorHandler } = require('../controllers')
const { authMiddleware } = require('../middlewares')

const { InvalidFilterTypeRequestError } = require('./errors')

const router = Router()

 /**
  * @swagger
  * path:
  *  /api/v1/logParser/nginx/all/:
  *    get:
  *      summary: Get all NGINX logs
  *      tags: [Log Parser - NGINX]
  *      security:
  *        - Bearer: []
  *      responses:
  *        "200":
  *          description: All NGINX logs returned
  *          content:
  *            application/json:
  *              schema:
  *                type: object
  *                properties:
  *                  message:
  *                    type: string
  *                  payload:
  *                    type: object
  *                    properties:
  *                      total:
  *                        type: number
  *                      logs:
  *                        type: array
  *                        items:
  *                          type: string
  *              example:
  *                message: returning all logs
  *                payload:
  *                  total: 1
  *                  logs:
  *                    - 172.17.0.1 - - [01/Sep/2020:04:41:50 +0000] "GET / HTTP/1.1" 200 396 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
  */
router.get('/nginx/all/', authMiddleware, errorHandler(async (_, res) => {
  console.log('reached here...')
  const logs = controllers.getAllLogs()
  res.status(200).json({
    message: 'returning all logs',
    payload: {
      total: logs.length,
      logs
    }
  })
}))

 /**

  * @swagger
  * path:
  *  /api/v1/logParser/nginx/filter/{filterType}/:
  *    get:
  *      summary: Get filtered NGINX logs
  *      tags: [Log Parser - NGINX]
  *      security:
  *        - Bearer: []
  *      parameters:
  *        - in: path
  *          name: filterType
  *          description: Type of filter to apply on NGINX logs. Its value can be either `ip` or `timestamp`.
  *          required: true
  *          type: string
  *          enum: [ip, timestamp]
  *        - in: query
  *          name: value
  *          description: If filterType is `ip` then use this parameter. E.g. "172.17.0.1"
  *          required: false
  *          type: string
  *        - in: query
  *          name: from
  *          description: If filterType is `timestamp` then use this parameter. E.g. "01/Sep/2020:04:41:50"
  *          required: false
  *          type: string
  *        - in: query
  *          name: to
  *          description: If filterType is `timestamp` then use this parameter. E.g. "01/Sep/2020:04:41:50"
  *          required: false
  *          type: string
  *      responses:
  *        200:
  *          description: Returning filters NGINX logs
  *          content:
  *            application/json:
  *              schema:
  *                type: object
  *                properties:
  *                  message:
  *                    type: string
  *                  payload:
  *                    type: object
  *                    properties:
  *                      total:
  *                        type: number
  *                      logs:
  *                        type: array
  *                        items:
  *                          type: string
  *              example:
  *                message: returning filtered logs
  *                payload:
  *                  total: 1
  *                  logs:
  *                    - 172.17.0.1 - - [01/Sep/2020:04:41:50 +0000] "GET / HTTP/1.1" 200 396 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
  *        400:
  *          description: Invalid request parameters received
  *          content:
  *            application/json:
  *              schema:
  *                type: object
  *                properties:
  *                  message:
  *                    type: string
  *              examples:
  *                invalidFilterType:
  *                  value:
  *                    message: invalid filter type
  *                invalidConditionValue:
  *                  value:
  *                    message: invalid condition value
  *                invalidConditionRange:
  *                  value:
  *                    message: invalid condition range
  */
router.get('/nginx/filter/:filterType/', authMiddleware, errorHandler(async (req, res) => {
  const { filterType } = req.params
  if (!filterType || !controllers.isValidFilterType(filterType)) {
    throw new InvalidFilterTypeRequestError()
  }
  const { value, from, to } = req.query
  const logs = await controllers.getFilteredLogs(filterType, value, from, to)
  res.status(200).json({
    message: 'returning filtered logs',
    payload: {
      total: logs.length,
      logs
    }
  })
}))

module.exports = router
