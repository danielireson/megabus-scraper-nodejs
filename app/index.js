require('dotenv').config()
const url = require('url')
const moment = require('moment')
const authenticator = require('./http/authenticator')
const router = require('./http/router')

module.exports = function (request, response) {
  console.log(moment().format('HH:mm') + ' Received request')

  authenticator(request, response)
  const params = url.parse(request.url).pathname.split('/').splice(1)
  router(request, response, params)
}
