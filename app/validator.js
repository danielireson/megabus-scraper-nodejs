const {createError} = require('micro')
const moment = require('moment')
const locations = require('./data/locations.json')

module.exports = function(originLocation, destinationLocation, startDate, endDate) {
  checkRequiredParams(originLocation, destinationLocation, startDate, endDate)
  checkValidLocation(originLocation)
  checkValidLocation(destinationLocation)
  checkValidDate(startDate)
  checkValidDate(endDate)
  checkDatesWithinOneMonth(startDate, endDate)
}

function checkRequiredParams(originLocation, destinationLocation, startDate, endDate) {
  if (originLocation == null) {
    throw createError(400, 'Origin location was not provided')
  }

  if (destinationLocation == null) {
    throw createError(400, 'Destination location was not provided')
  }

  if (startDate == null) {
    throw createError(400, 'Start date was not provided')
  }

  if (endDate == null) {
    throw createError(400, 'End date was not provided')
  }
}

function checkValidLocation(location) {
  if (!(location in locations)) {
    throw createError(400, `${location} is not a valid location`)
  }
}

function checkValidDate(date) {
  if (!moment(date, 'DD-MM-YYYY').isValid()) {
    throw createError(400, `${date} is not a valid date string, dates should be formatted as 'dd-mm-yyyy'`)
  }
}

function checkDatesWithinOneMonth(startDate, endDate) {
  if (moment(endDate, 'DD-MM-YYYY') > moment(startDate, 'DD-MM-YYYY').add(1, 'months')) {
    throw createError(400, 'Search dates must be within one month of each other')
  }
}
