const url = require('url')
const dotenv = require('dotenv').config()
const {send} = require('micro')
const authenticator = require('./authenticator')
const validator = require('./validator')
const scraper = require('./scraper')

// Request format == /:originLocation/:desinationLocation/:startDate/:endDate
module.exports = async function (request, response) {
  authenticator(request)

  const params = url.parse(request.url).pathname.split('/').splice(1)
  validator(...params)

  let results = await scraper(...params)

  let json = {
    code: 200,
    message: 'There were X results',
    data: []
  }
  
  send(response, 200, json)
}
