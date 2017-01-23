const {createError} = require('micro')

module.exports = function(originLocation, destinationLocation, startDate, endDate) {
  checkRequiredParams(originLocation, destinationLocation, startDate, endDate)
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
