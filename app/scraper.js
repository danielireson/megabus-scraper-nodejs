const moment = require('moment')
const locations = require('./data/locations.json')

module.exports = function(originLocation, destinationLocation, startDate, endDate) {
  let originCode = lookupLocationCode(originLocation)
  let destinationCode = lookupLocationCode(destinationLocation)
  return runScrapers(originCode, destinationCode, startDate, endDate)
}

function runScrapers(originCode, destinationCode, startDate, endDate) {
  let results = []
  for (let i = 0; i < getNoOfDays(startDate, endDate); i++) {
    let date = addDays(startDate, i)
    let url = buildUrl(originCode, destinationCode, date)
    results.push(scrapePage(url))
  }
  return results
}

function scrapePage() {
  
}

function getNoOfDays(startDate, endDate) {
  return moment(endDate, 'DD-MM-YYYY').diff(moment(startDate, 'DD-MM-YYYY'), 'days') + 1
}

function addDays(date, i) {
  return moment(date, 'DD-MM-YYYY').add(i, 'days').format('DD-MM-YYYY')
}

function buildUrl(originCode, destinationCode, date) {
  let url = 'http://uk.megabus.com/JourneyResults.aspx?passengerCount=1&withReturn=0&'
  url += 'originCode=' + originCode + '&'
  url += 'destinationCode=' + destinationCode + '&'
  url += 'outboundDepartureDate=' + date.replace(/-/g, '%2f')
  return url
}

function lookupLocationCode(location) {
  return locations[location]
}
