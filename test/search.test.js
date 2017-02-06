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

test('search: order of dates', async t => {
  let today = moment().format('DD-MM-YYYY')
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  let options = buildRequestOptions(t.context.url, 'search', 'manchester', 'london', tomorrow, today)
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, 'The provided search start date is after the search end date')
})

test('search: invalid search start date', async t => {
  let options = buildRequestOptions(t.context.url, 'search', 'manchester', 'london', 'start-date-invalid')
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, "start-date-invalid is not a valid date string, dates should be formatted as 'dd-mm-yyyy'")
})

test('search: invalid search start date', async t => {
  let options = buildRequestOptions(t.context.url, 'search', 'manchester', 'london', 'end-date-invalid')
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, "end-date-invalid is not a valid date string, dates should be formatted as 'dd-mm-yyyy'")
})

test('search: dates not within one month', async t => {
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  let tomorrowPlusTwoMonth = moment().add(60, 'days').format('DD-MM-YYYY')
  let options = buildRequestOptions(t.context.url, 'search', 'manchester', 'london', tomorrow, tomorrowPlusTwoMonth)
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, 'Search dates must be within one month of each other')
})

test('search: date future check', async t => {
  let today = moment().format('DD-MM-YYYY')
  let options = buildRequestOptions(t.context.url, 'search', 'manchester', 'london', today)
  let result = await t.throws(request(options))
  t.is(result.error.code, 400)
  t.is(result.error.message, 'Search dates must be in the future')
})
