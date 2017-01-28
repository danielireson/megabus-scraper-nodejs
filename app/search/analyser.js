module.exports = function(results) {
  let noOfJourneys = 0
  let prices = []

  if (results.length === 0) {
    return {
      noOfJourneys: 0    
    }
  }

  for (let day of results) {
    noOfJourneys += day.journeys.length
    for (let journey of day.journeys) {
      prices.push(Number(journey.price))
    }
  }

  prices.sort((a, b) => a - b)

  return {
    noOfJourneys: noOfJourneys,
    lowestPrice: getLowestPrice(prices),
    highestPrice: getHighestPrice(prices),
    meanPrice: getMeanPrice(prices),
    medianPrice: getMedianPrice(prices),
    priceRange: getPriceRange(prices)
  }
}

function getLowestPrice(prices) {
  return prices[0].toFixed(2)
}

function getHighestPrice(prices) {
  return prices[prices.length - 1].toFixed(2)
}

function getMeanPrice(prices) {
  return (prices.reduce((a, b) => a += b) / prices.length).toFixed(2)
}

function getMedianPrice(prices) {
  let middle = (prices.length - 1) / 2
  return ((prices[Math.floor(middle)] + prices[Math.ceil(middle)]) / 2).toFixed(2) 
}

function getPriceRange(prices) {
  return (getHighestPrice(prices) - getLowestPrice(prices)).toFixed(2)
}
