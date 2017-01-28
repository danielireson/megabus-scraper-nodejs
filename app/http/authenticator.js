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
  const userKey = request.headers['x-authorization']
  const apiKey = process.env.API_KEY || 'megabus-scraper-nodejs'

  if (userKey == null) {
    let error = createError(401, 'Please set the X-Authorization header with a valid API key')
    responder.sendErrorAsJson(response, error)
  }

  if (userKey !== apiKey) {
    let error = createError(401, 'Invalid API key passed as X-Authorization header')
    responder.sendErrorAsJson(response, error)
  }
}
