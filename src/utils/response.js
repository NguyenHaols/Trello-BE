export const response = (success, message, data) => {

  const responseObject = {
    success: success,
    message: message,
  }

  if (data !== undefined) {
    responseObject.data = data
  }

  return responseObject
}