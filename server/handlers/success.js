class SuccessResponseHandler {
  constructor (
    status,
    message,
    body,
    responseHeaders = null
  ) {
    this.status = status
    this.message = message
    this.body = body
    this.responseHeaders = responseHeaders
  }

  getBodyResponse () {
    return this.body
  }
}

const handleSuccess = (succ, res) => {
  const { status, message, body, responseHeaders } = succ
  const response = {
    status,
    message,
    body
  }

  if (responseHeaders !== null) {
    responseHeaders.forEach(header => {
      res.setHeader(header.header, header.value)
    })
  }

  res.status(status).json(response)
}

export {
  handleSuccess,
  SuccessResponseHandler
}
