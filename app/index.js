const url = require('url')
const {send} = require('micro')
const validator = require('./validator')

module.exports = async function (request, response) {
  // :originLocation/:desinationLocation/:startDate/:endDate
  const params = url.parse(request.url).pathname.split('/').splice(1)
  validator(...params)

  let json = {
    code: 200,
    message: 'There were X results',
    data: []
  }
  
  send(response, 200, json)
}
