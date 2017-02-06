require('async-to-gen/register')
require('dotenv').config()
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const moment = require('moment')
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

test('search: no origin location', async t => {
  let options = buildRequestOptions(t.context.url, 'search')
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, 'Origin location was not provided')
})

test('search: no destination location', async t => {
  let options = buildRequestOptions(t.context.url, 'search', 'manchester')
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, 'Destination location was not provided')
})

test('search: no search start date', async t => {
  let options = buildRequestOptions(t.context.url, 'search', 'manchester', 'london')
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, 'Start date was not provided')
})
