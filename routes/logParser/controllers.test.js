'use strict'

const dotenv = require('dotenv')

const { getAllLogs, getFilteredLogs } = require('./controllers')

beforeAll(() => {
  dotenv.config({ path: '.env.test' })
})

test('should return all logs', () => {
  const logs = getAllLogs()
  expect(logs).toHaveLength(23)
})

test('should return all (ip-filtered) logs', async () => {
  const logs = await getFilteredLogs('ip', '172.17.0.1', undefined, undefined)
  expect(logs).toHaveLength(23)
})

test('should return all (timestamp-filtered) logs', async () => {
  const logs = await getFilteredLogs('timestamp', undefined, '01/Sep/2020:04:41:50', '01/Sep/2020:04:41:56')
  expect(logs).toHaveLength(23)
})

test('should return only timestamp-filtered logs', async () => {
  const logs = await getFilteredLogs('timestamp', undefined, '01/Sep/2020:04:41:50', '01/Sep/2020:04:41:53')
  expect(logs).toHaveLength(5)
})

test('should return only logs of a single day', async () => {
  const logs = await getFilteredLogs('timestamp', undefined, '01/Sep/2020:04:41:50', '01/Sep/2020:04:41:50')
  expect(logs).toHaveLength(2)
})

test('should return only ip-filtered logs', async () => {
  const logs = await getFilteredLogs('ip', '172.17.0.2', undefined, undefined)
  expect(logs).toHaveLength(0)
})
