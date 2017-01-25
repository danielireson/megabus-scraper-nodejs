const url = require('url')
const dotenv = require('dotenv').config()
const {send} = require('micro')
const moment = require('moment')
const authenticator = require('./middleware/authenticator')
const validator = require('./middleware/validator')
const scraper = require('./scraper')
const analyser = require('./analyser')

// Request format == /:originLocation/:desinationLocation/:startDate/:endDate
module.exports = async function (request, response) {
  console.log(moment().format('HH:mm') + ' Received request')

  try {
    authenticator(request)

    const params = url.parse(request.url).pathname.split('/').splice(1)
    validator(...params)

    let results = await scraper(...params)
    sendResultsAsJson(response, results)

  } catch (error) {
    sendErrorAsJson(response, error)
  }
}

function sendErrorAsJson(response, error) {
  let json = {
    code: error.statusCode,
    message: error.message
  }
  send(response, error.statusCode, json)
}

function sendResultsAsJson(response, results) {
  let analysis = analyser(results)
  let json = {
    code: 200,
    message: `There are ${analysis.noOfJourneys} journeys`,
    stats: analysis,
    data: results
  }
  send(response, 200, json)
}
