# Megabus UK Price Scraper
A small Node.js API to scrape megabus prices over a search period and return results in JSON format. Not associated with megabus.com, use at your own discretion.

## Setup
### Environment variables
Authentication and CORS control is provided through environment variables. These can be set via the OS or through a *env* file at the the root of your project. Clients making requests to the API have to pass a valid API key as an *X-Authorization* HTTP header, otherwise a 401 HTTP status code will be returned. If *API_KEY* is not set the key will default to accepting *megabus-scraper-nodejs* as the *X-Authorization* value. You can change the allowed CORS origin domains by setting a *CORS_ORIGIN* key. For more information on CORS see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS). This defaults to accepting all domain requests. 
``` text
API_KEY=
CORS_ORIGIN=
```

### Commands
Install the dependencies through *npm install* and then run *npm run start:dev* to launch the server on port 3000. You can change the development port number by editing the *package.json* script command. Starting the server via *npm run start:prod* launches the server on the port specified by a *PORT* environment variable and prevents error logs being sent in API responses. The *PORT* environment variable has to be set via the OS and can't be set via the *.env* file in the root of the project (*.env* loading uses the *dotenv* npm package to the environment variables, but this only happens after the server has been started).
``` bash
# install dependencies
npm install

# start the server in development mode
npm run start:dev

# start in production mode
npm run start:prod
```

## Usage
### Making a search
API search requests should be made in the following format.
```
# structure
GET http://localhost:3000/search/{from}/{to}/{search-date-start}/{search-date-end:optional}

# example
GET http://localhost:3000/search/manchester/london/01-03-2017/21-03-2017
```
Valid megabus locations have to be passed in place of the *from* and *to* fields. See *locations.json* in the *app/storage* folder for a list of valid locations. If a location code is passed that doesn't exist then a 400 HTTP status code will be returned.  Dates must be in the future, should be passed in the format *DD-MM-YYYY* and should be within a month of each other. The *search-date-end* parameter is optional. If an invalid date is passed then the client will also return a 400 HTTP status code and relevant message.

### Get valid locations
A list of valid megabus origin/desintation locations can be returned by making a GET request to the *locations* endpoint.
```
GET http://localhost:3000/locations
```
### Responses
Responses are returned in JSON with a HTTP status *code* always present. Search results will be returned in an array. Prices are sent in GBP and times are in 24hr format, both formatted as strings. Basic statistics for the search results are provided on the *stats* key.
``` json
{
  "code": 200,
  "message": "There are 3 journeys.",
  "stats": {
    "noOfJourneys": 3,
    "lowestPrice": "10.00",
    "highestPrice": "15.00",
    "meanPrice": "12.00",
    "medianPrice": "11.00",
    "priceRange": "5.00"
  },
  "data": [
    {
        "date": "01-03-2017",
        "journeys": [
            {
                "departure": {
                    "time": "06:25",
                    "location": "Manchester , Shudehill Interchange Stand G"
                },
                "arrival": {
                    "time": "11:25",
                    "location": "Bristol UWE , University of West England, North Gate, Frenchay Campus"
                },
                "duration": "5hrs 0mins",
                "price": "11.00"
            },
            {
                "departure": {
                    "time": "06:25",
                    "location": "Manchester , Shudehill Interchange Stand G"
                },
                "arrival": {
                    "time": "11:25",
                    "location": "Bristol UWE , University of West England, North Gate, Frenchay Campus"
                },
                "duration": "5hrs 0mins",
                "price": "11.00"
            },
            {
                "departure": {
                    "time": "06:25",
                    "location": "Manchester , Shudehill Interchange Stand G"
                },
                "arrival": {
                    "time": "11:25",
                    "location": "Bristol UWE , University of West England, North Gate, Frenchay Campus"
                },
                "duration": "5hrs 0mins",
                "price": "11.00"
            }
        ]
    },
  ]
}
```
