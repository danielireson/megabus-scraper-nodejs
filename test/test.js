require('async-to-gen/register')
require('dotenv').config()
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const moment = require('moment')
const app = require('../app')

function launchServerOnUniquePort() {
  return listen(micro(app))
}

test.beforeEach(async t => {
  t.context.url = await launchServerOnUniquePort()
})

function buildRequestOptions(routes) {
  let url = routes.join('/')
  return {
    uri: url,
    headers: {
      'X-Authorization': process.env.API_KEY
    },
    json: true
  }
}

test('locations: get all megabus locations', async t => {
  let options = buildRequestOptions([t.context.url, 'locations'])
  let result = await request(options)
  t.is(result.code, 200)
  t.is(Object.keys(result.data).length, 98)
})

async function runSearchFailureTest(t, routes, expectedHttpCode, expectedMessage) {
  let options = buildRequestOptions([t.context.url].concat(routes))
  let result = await t.throws(request(options))
  t.is(result.error.code, expectedHttpCode)
  t.is(result.error.message, expectedMessage)
}

async function runSearchSuccessTest(t, routes, expectedHttpCode) {
  let options = buildRequestOptions([t.context.url].concat(routes))
  let result = await request(options)
  t.is(result.code, 200)
}

test('search: no origin location', async t => {
  await runSearchFailureTest(t, ['search'], 400, 'Origin location was not provided')
})

test('search: no destination location', async t => {
  await runSearchFailureTest(t, ['search','manchester'], 400, 'Destination location was not provided')
})

test('search: invalid origin location', async t => {
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  await runSearchFailureTest(t, ['search', 'invalid', 'london', tomorrow], 400, 'invalid is not a valid location')
})

test('search: invalid destination location', async t => {
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  await runSearchFailureTest(t, ['search', 'manchester', 'invalid', tomorrow], 400, 'invalid is not a valid location')
})

test('search: no search start date', async t => {
  await runSearchFailureTest(t, ['search', 'manchester', 'london'], 400, 'Start date was not provided')
})

test('search: order of dates', async t => {
  let today = moment().format('DD-MM-YYYY')
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  await runSearchFailureTest(t, ['search', 'manchester', 'london', tomorrow, today], 400, 'The provided search start date is after the search end date')
})

test('search: invalid search start date', async t => {
  await runSearchFailureTest(t, ['search', 'manchester', 'london', 'start-date-invalid'], 400, 'start-date-invalid is not a valid date string, dates should be formatted as DD-MM-YYYY')
})

test('search: invalid search start date', async t => {
  await runSearchFailureTest(t, ['search', 'manchester', 'london', 'end-date-invalid'], 400, 'end-date-invalid is not a valid date string, dates should be formatted as DD-MM-YYYY')
})

test('search: dates not within one month', async t => {
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  let tomorrowPlusTwoMonth = moment().add(60, 'days').format('DD-MM-YYYY')
  await runSearchFailureTest(t, ['search', 'manchester', 'london', tomorrow, tomorrowPlusTwoMonth], 400, 'Search dates must be within one month of each other')
})

test('search: date future check', async t => {
  let today = moment().format('DD-MM-YYYY')
  await runSearchFailureTest(t, ['search', 'manchester', 'london', today], 400, 'Search dates must be in the future')
})

test('search: manchester to london for tomorrow', async t => {
  let tomorrow = moment().add(1, 'days').format('DD-MM-YYYY')
  await runSearchSuccessTest(t, ['search', 'manchester', 'london', tomorrow], 200)
})

test('search: newcastle to bristol in two weeks', async t => {
  let date = moment().add(14, 'days').format('DD-MM-YYYY')
  await runSearchSuccessTest(t, ['search', 'newcastle', 'bristol', date], 200)
})

test('search: york to liverpool sometime within a week', async t => {
  let randDaysToAdd = Math.floor(Math.random() * 7) + 1
  let date = moment().add(randDaysToAdd, 'days').format('DD-MM-YYYY')
  await runSearchSuccessTest(t, ['search', 'york', 'liverpool', date], 200)
})
