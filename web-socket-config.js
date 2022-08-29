const { WebSocketServer } = require('ws')
module.exports = (server, path = '/room') => new WebSocketServer({ server, path })
