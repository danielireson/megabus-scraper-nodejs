require('async-to-gen/register')
require('dotenv').config()
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const app = require('../app')

function buildRequestOptions(...routes) {
  let url = routes.join('/')
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

test('locations: get all megabus locations', async t => {
  let options = buildRequestOptions(t.context.url, 'locations')
  let result = await request(options)
  t.is(result.code, 200)
  t.is(Object.keys(result.data).length, 98)
})
