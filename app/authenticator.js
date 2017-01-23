const {createError} = require('micro')

module.exports = function(request) {
  const key = request.headers['x-authorization']

  if (key == null) {
    throw createError(400, 'Please set the X-Authorization header with a valid API key')
  }

  if (key !== 'test') {
    throw createError(400, 'Invalid API key passed as X-Authorization header')
  }
}
