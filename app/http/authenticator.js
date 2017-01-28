const {createError} = require('micro')

module.exports = function(request) {
  const key = request.headers['x-authorization']

  if (key == null) {
    throw createError(401, 'Please set the X-Authorization header with a valid API key')
  }

  if (key !== process.env.API_KEY) {
    throw createError(401, 'Invalid API key passed as X-Authorization header')
  }
}
