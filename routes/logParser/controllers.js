'use strict'

const fs = require('fs')
const util = require('util')
const childProcess = require('child_process')

const {
  InvalidConditionValueRequestError,
  InvalidConditionRangeRequestError,
} = require('../errors')

const exec = util.promisify(childProcess.exec)

const filterTypes = {
  ip: '$1',
  timestamp: '$4'
}

/**
 * Validates whether the given `filterType` is valid or not
 * 
 * @param {string} filterType 
 * 
 * @returns {boolean}
 */
function isValidFilterType(filterType) {
  return Object.keys(filterTypes).includes(filterType)
}

/**
 * Returns all the logs from NGINX log file
 * 
 * @returns {Array<string>}
 */
function getAllLogs() {
  let logs = fs.readFileSync(process.env.LOG_FILE_PATH, { flag: 'r' }).toString('utf8')
  return logs.trim().split('\n')
}

/**
 * Returns all the filtered logs from NGINX log file
 * 
 * @param {string} filterType 
 * @param {string} value if `filterType` is "ip", otherwise optional
 * @param {string} from if `filterType` is "timestamp", otherwise optional
 * @param {string} to if `filterType` is "timestamp", otherwise optional
 * 
 * @returns {Array<string>}
 */
async function getFilteredLogs(filterType, value, from, to) {
  switch (filterType) {
    case 'ip':
      if (!value || '' === value) {
        throw new InvalidConditionValueRequestError()
      }
      return await filterLogsOnEquality(filterTypes[filterType], value)
    case 'timestamp':
      if (!from || !to || [from, to].includes('')) {
        throw new InvalidConditionRangeRequestError()
      }
      return await filterLogsOnRange(filterTypes[filterType], from, to)
  }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// |                                                                                        |
// |                                Helper functions                                        |
// |                                                                                        |
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

/**
 * Get logs filtered based on an equality condition
 * 
 * @param {string} filterTypeId 
 * @param {string} value 
 * 
 * @returns {Array<string>}
 */
async function filterLogsOnEquality(filterTypeId, value) {
  const cmd = `awk '${filterTypeId}=="${value}"' ${process.env.LOG_FILE_PATH}`
  return await getLogsFromShell(cmd)
}

/**
 * Get logs filtered based on a range condition
 * 
 * @param {string} filterTypeId 
 * @param {string} from 
 * @param {string} to 
 * 
 * @returns {Array<string>}
 */
async function filterLogsOnRange(filterTypeId, from, to) {
  const cmd = `awk '${filterTypeId}>="[${from}" && ${filterTypeId}<="[${to}"' ${process.env.LOG_FILE_PATH}`
  return await getLogsFromShell(cmd)
}

/**
 * Execute given command in shell and return the logs from stdout
 * 
 * @param {string} cmd 
 * 
 * @returns {Array<string>}
 */
async function getLogsFromShell(cmd) {
  const { stdout } = await exec(cmd)
  const logs = stdout.trim().split('\n')
  return (1 === logs.length && '' === logs[0]) ? [] : logs
}

module.exports = {
  isValidFilterType,
  getAllLogs,
  getFilteredLogs,
}
