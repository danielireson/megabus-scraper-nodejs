const {send} = require('micro')
const analyser = require('../search/analyser')

module.exports.sendResultsAsJson = function(response, results) {
  let analysis = analyser(results)
  let json = {
    code: 200,
    message: `There are ${analysis.noOfJourneys} journeys`,
    stats: analysis,
    data: results
  }
  send(response, 200, json)
}

module.exports.sendErrorAsJson = function(response, error) {
  let json = {
    code: error.statusCode,
    message: error.message
  }
  send(response, error.statusCode, json)
}
