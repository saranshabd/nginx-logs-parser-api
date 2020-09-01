'use strict'

const { Router } = require('express')

const router = Router()

const apiRoutes = ['logParser']
apiRoutes.forEach(apiRoute => router.use(`/${apiRoute}/`, require(`./${apiRoute}`)))

module.exports = router
