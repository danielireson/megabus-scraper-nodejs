const {createError} = require('micro')
const validator = require('./validator')
const scraper = require('../search/scraper')
const responder = require('./responder')

module.exports = function(request, response, params) {
  if (request.method === 'OPTIONS') {
    optionsHandler(response)
  } else {
    let route = params[0]
    params = params.splice(1)
    switch(route) {
      case 'locations':
        locationsHandler(response)
        break
      case 'search':
        searchHandler(response, params)
        break
      default:
        noRouteHandler(response, params)
    }
  }
}

async function searchHandler(response, params) {
  try {
    validator(...params)
    let results = await scraper(...params)
    responder.sendResultsAsJson(response, results)
  } catch (error) {
    responder.sendErrorAsJson(response, error)
  }
}

function locationsHandler(response, params) {
  responder.sendLocationsAsJson(response)  
}

function noRouteHandler(response, params) {
  let error = createError(404, 'The requested route was not found')
  responder.sendErrorAsJson(response, error)
}

function optionsHandler(response) {
  responder.sendOptionsResponse(response)
}
