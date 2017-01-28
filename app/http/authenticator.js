const {createError} = require('micro')
const responder = require('../http/responder')

module.exports = function(request, response) {
  checkOptionsRequest(request, response)
  checkApiKey(request, response)
}

function checkOptionsRequest(request, response) {
  if (request.method === 'OPTIONS') {
    responder.sendOptionsResponse(response)
  }
}

function checkApiKey(request, response) {
  const key = request.headers['x-authorization']

  if (key == null) {
    let error = createError(401, 'Please set the X-Authorization header with a valid API key')
    responder.sendErrorAsJson(response, error)
  }

  if (key !== process.env.API_KEY) {
    let error = createError(401, 'Invalid API key passed as X-Authorization header')
    responder.sendErrorAsJson(response, error)
  }
}
