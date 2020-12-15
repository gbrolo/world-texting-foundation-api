import { request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ErrorHandler } from '../handlers/error'
import { MISSING_PARAMETER_ERROR, UNAUTHORIZED_ERROR, INVALID_PARAMETER_ERROR } from './errors'

/**
 * verifies if required params are present
 * @param {Array[string]} paramList string array with required params
 * @param {Object} requestParams req query params
 */
const verifyPresentParams = (
  paramList,
  requestParams
) => {  
  return new Promise((resolve, reject) => {    
    const requestParamsKeys = Object.keys(requestParams)
    const verification = paramList.every(v => requestParamsKeys.includes(v))    

    if (verification) {
      resolve()
    } else {
      reject(
        new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          MISSING_PARAMETER_ERROR.errorId,
          MISSING_PARAMETER_ERROR.errorMessage,
          'verifyPresentParams(...)',
          MISSING_PARAMETER_ERROR.errorMessage
        )
      )
    }
  })
}

const validatePresentParams = (
  requestParams,
  requestParamsComparators
) => {
  return new Promise((resolve, reject) => {    
    for (const prop in requestParams) {
      if (requestParams[prop] !== undefined) {
        if (requestParamsComparators.hasOwnProperty(prop) && !requestParamsComparators[prop](requestParams[prop])) {
          reject(
            new ErrorHandler(
              StatusCodes.BAD_REQUEST,
              INVALID_PARAMETER_ERROR.errorId,
              INVALID_PARAMETER_ERROR.errorMessage,
              'validatePresentParams(...)',
              INVALID_PARAMETER_ERROR.errorMessage
            )
          )
        }
      }
    }
    resolve()    
  })
}

/**
 * Verifies if user is authenticated by extracting Bearer Token from authorization
 * Should check if given token is valid, but for this example, there is no OAuth system or similar to
 * check tokens
 * @param {Object} req Express request object
 */
const getAuthenticationToken = (req) => {
  return new Promise((resolve, reject) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      resolve(req.headers.authorization.split(' ')[1])
    } else {
      reject(
        new ErrorHandler(
          StatusCodes.UNAUTHORIZED,
          UNAUTHORIZED_ERROR.errorId,
          UNAUTHORIZED_ERROR.errorMessage,
          'getAuthenticationToken(...)',
          UNAUTHORIZED_ERROR.errorMessage
        )
      )
    }
  })
}

const validateInteger = (str) => {  
  const number = parseInt(str)
  return !isNaN(number)
}

export {
  validateInteger,
  verifyPresentParams,
  validatePresentParams,
  getAuthenticationToken
}
