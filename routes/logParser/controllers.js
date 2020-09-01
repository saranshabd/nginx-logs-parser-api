'use strict'

const nginxLogParserController = require('../../controllers/nginxLogParser')

const {
  InvalidConditionValueRequestError,
  InvalidConditionRangeRequestError,
} = require('./errors')

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
  return nginxLogParserController.getAllLogs()
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
      return await nginxLogParserController.filterLogsOnEquality(filterTypes[filterType], value)
    case 'timestamp':
      if (!from || !to || [from, to].includes('')) {
        throw new InvalidConditionRangeRequestError()
      }
      return await nginxLogParserController.filterLogsOnRange(filterTypes[filterType], from, to)
  }
}

module.exports = {
  isValidFilterType,
  getAllLogs,
  getFilteredLogs,
}
