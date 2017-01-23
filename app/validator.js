const {createError} = require('micro')
const locations = require('./data/locations.json')

module.exports = function(originLocation, destinationLocation, startDate, endDate) {
  checkRequiredParams(originLocation, destinationLocation, startDate, endDate)
  checkValidLocation(originLocation)
  checkValidLocation(destinationLocation)
}

function checkRequiredParams(originLocation, destinationLocation, startDate, endDate) {
  if (originLocation == null) {
    throw createError(400, "Origin location was not provided")
  }

  if (destinationLocation == null) {
    throw createError(400, "Destination location was not provided")
  }

  if (startDate == null) {
    throw createError(400, "Start date was not provided")
  }

  if (endDate == null) {
    throw createError(400, "End date was not provided")
  }
}

function checkValidLocation(location) {
  if (!(location in locations)) {
    throw createError(400, `${location} is not a valid location`)
  }
}
