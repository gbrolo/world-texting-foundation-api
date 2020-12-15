import { StatusCodes } from 'http-status-codes'
import { ErrorHandler } from '../handlers/error'
import { MISSING_PARAMETER_ERROR } from './errors'

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

export {
  verifyPresentParams
}
