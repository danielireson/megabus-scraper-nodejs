const cheerio = require('cheerio')
const moment = require('moment')
const request = require('request-promise')
const locations = require('./data/locations.json')

module.exports = function(originLocation, destinationLocation, startDate, endDate) {
  endDate = endDate || startDate
  let originCode = lookupLocationCode(originLocation)
  let destinationCode = lookupLocationCode(destinationLocation)
  return runScrapers(originCode, destinationCode, startDate, endDate)
}

async function runScrapers(originCode, destinationCode, startDate, endDate) {
  let results = []
  for (let i = 0; i < getNoOfDays(startDate, endDate); i++) {
    let date = addDays(startDate, i)
    let url = buildUrl(originCode, destinationCode, date)
    results.push(await getJourneysFromUrl(url))
  }
  return results
}

function getJourneysFromUrl(url) {
  return new Promise(function(resolve, reject) {
    let options = {
      uri: url,
      headers: {
        'User-Agent': getRandomUserAgent()
      }
    }
    request(options).then(function(html) {
      resolve(scrapeJourneysFromHtml(html))
    }).catch(function(error) {
      reject(null)
    })
  })
}

function scrapeJourneysFromHtml(html) {
  let $ = cheerio.load(html)
  let journeys = []
  $('.journey').each(function (journeyIndex, journeyEl) {
    let journeyDetailsChildren = $(journeyEl).children('.two').first().children()
    journeys.push({
      departure: extractTimeAndLocation($(journeyDetailsChildren[0])),
      arrival: extractTimeAndLocation($(journeyDetailsChildren[1])),
      duration: extractDuration($(journeyEl).children('.three').first().children().first()),
      price: extractPrice($(journeyEl).children('.five').first().children().first())
    })
  })
  return journeys
}

function extractTimeAndLocation(el) {
  let text = removeEmptySpace(el.text())
  return {
    time: text.substring(8, 13),
    location: text.substring(14)
  }
}

function extractDuration(el) {
  return removeEmptySpace(el.text())
}

function extractPrice(el) {
  return removeEmptySpace(el.text()).substring(1)  
}

function getRandomUserAgent() {
  let agents = [
    'Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.7; AOLBuild 4343.19; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C; .NET4.0E)',
    'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US)',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1a2pre) Gecko/2008073000 Shredder/3.0a2pre ThunderBrowse/3.2.1.8',
    'Mozilla/5.0 Slackware/13.37 (X11; U; Linux x86_64; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/12.0.742.91'
  ]
  return agents[Math.round(Math.random() * (agents.length - 1))]
}

function buildUrl(originCode, destinationCode, date) {
  let url = 'http://uk.megabus.com/JourneyResults.aspx?passengerCount=1&withReturn=0&'
  url += 'originCode=' + originCode + '&'
  url += 'destinationCode=' + destinationCode + '&'
  url += 'outboundDepartureDate=' + date.replace(/-/g, '%2f')
  return url
}

function removeEmptySpace(html) {
  return html.replace(/\s\s+/g, ' ').trim()
}

function getNoOfDays(startDate, endDate) {
  return moment(endDate, 'DD-MM-YYYY').diff(moment(startDate, 'DD-MM-YYYY'), 'days') + 1
}

function addDays(date, i) {
  return moment(date, 'DD-MM-YYYY').add(i, 'days').format('DD-MM-YYYY')
}

function lookupLocationCode(location) {
  return locations[location]
}
