require('async-to-gen/register')
require('dotenv').config()
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const app = require('../app')

function buildRequestOptions(...routes) {
  let url = routes.reduce((concat, route) => concat += '/' + route)
  return {
    uri: url,
    headers: {
      'X-Authorization': process.env.API_KEY
    },
    json: true
  }
}

function launchServerOnUniquePort() {
  return listen(micro(app))
}

test.beforeEach(async t => {
  t.context.url = await launchServerOnUniquePort()
})

test('search: failure', async t => {
  let options = buildRequestOptions(t.context.url, 'search')
  const body = await request(options) 
})
