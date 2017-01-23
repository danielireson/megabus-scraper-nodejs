const {send} = require('micro')

module.exports = async function (request, response) {
  let json = {
    code: 200,
    message: 'There were X results',
    data: []
  }
  
  send(response, 200, json)
}
