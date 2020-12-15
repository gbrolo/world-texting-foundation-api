class SuccessResponseHandler {
  constructor(
    status,
    message, 
    body
  ) {        
    this.status = status        
    this.message = message
    this.body = body
  }

  getBodyResponse() {
    return this.body
  }
}

const handleSuccess = (succ, res) => {
  const { status, message, body } = succ
  const response = {
    status,
    message,
    body,
  }
  res.status(status).json(response)
}

export {
  handleSuccess,
  SuccessResponseHandler
}