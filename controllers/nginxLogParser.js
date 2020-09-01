'use strict'

const fs = require('fs')
const util = require('util')
const childProcess = require('child_process')

const exec = util.promisify(childProcess.exec)

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

module.exports = {
  getAllLogs,
  filterLogsOnEquality,
  filterLogsOnRange,
}
