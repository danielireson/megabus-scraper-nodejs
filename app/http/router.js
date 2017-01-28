const {createError} = require('micro')
const validator = require('./validator')
const scraper = require('../search/scraper')
const responder = require('./responder')

module.exports = function(response, params) {
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

async function searchHandler(response, params) {
  try {
    validator(...params)
  } catch (error) {
    responder.sendErrorAsJson(response, error)
  }

  let results = await scraper(...params)
  responder.sendResultsAsJson(response, results)
}

function locationsHandler(response, params) {
  responder.sendLocationsAsJson(response)  
}

function noRouteHandler(response, params) {
  let error = createError(404, 'The requested route was not found')
  responder.sendErrorAsJson(response, error)
}
