const url = require('url')
const {send} = require('micro')
const authenticator = require('./authenticator')
const validator = require('./validator')

// Request format == /:originLocation/:desinationLocation/:startDate/:endDate
module.exports = async function (request, response) {
  authenticator(request)

  const params = url.parse(request.url).pathname.split('/').splice(1)
  validator(...params)

  let json = {
    code: 200,
    message: 'There were X results',
    data: []
  }
  
  send(response, 200, json)
}
