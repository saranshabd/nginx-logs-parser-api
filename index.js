'use strict'

const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

dotenv.config()
const app = express()

app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/v1/', require('./routes'))

const specs = swaggerJsdoc(require('./swagger-ui.config.json'))
app.use('/api/v1/docs/', swaggerUi.serve);
app.get('/api/v1/docs/', swaggerUi.setup(specs, { explorer: true }))

const port = process.env.PORT
app.listen(port, console.log(`app running on port ${port}...`))
