class ErrorHandler extends Error {
  constructor (
    status,
    errorId,
    errorMessage,
    errorLocation,
    errorStackTrace
  ) {
    super()
    this.status = status
    this.errorId = errorId
    this.errorMessage = errorMessage
    this.errorLocation = errorLocation
    this.errorStackTrace = errorStackTrace
  }
}

const handleError = (error, req, res) => {
  const {
    status,
    errorId,
    errorMessage,
    errorLocation,
    errorStackTrace
  } = error

  req.errorLogger.log('error', `[${errorId}] [${errorLocation}] [${JSON.stringify(errorStackTrace)}]`)
  res
    .status(status)
    .json({
      status,
      errorId,
      errorMessage
    })
}

export {
  handleError,
  ErrorHandler
}
