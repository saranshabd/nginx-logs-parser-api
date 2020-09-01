'use strict'

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const jwt = require('jsonwebtoken')

global.fetch = require('node-fetch')

const userPoolData = {
  UserPoolId: process.env.AWS_COGNITO_POOL_ID,
  ClientId: process.env.AWS_COGNITO_APP_CLIENT_ID,
}
const userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)

/**
 * Authenticate a registered user & get its login credentials
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {object}
 */
function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    const loginDetails = {
      Username: email,
      Password: password,
    }
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails)
    const userDetails = {
      Username: email,
      Pool: userPool,
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails)
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: data => resolve(data),
      onFailure: err => reject(err)
    })
  })
}

/**
 * Validates the given authentication token
 * 
 * @todo The function validates the authentication very poorly. Use the user's email address
 * present inside the `decodedToken` to fetch CognitoUserData and then verify the given
 * authentication token's attributes.
 * 
 * @param {string} jwtToken 
 * 
 * @returns {boolean}
 */
function validateUserIdToken(jwtToken) {
  const decodedToken = jwt.decode(jwtToken, { complete: true })
  return decodedToken ? true : false
}

module.exports = {
  authenticateUser,
  validateUserIdToken,
}
