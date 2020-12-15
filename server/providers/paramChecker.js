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
      reject(new Error('No text param present'))
    }
  })
}

export {
  verifyPresentParams
}
