const { app } = require('./express-config')
const { WebSocket } = require('ws')
const getWebSocketServer = require('./web-socket-config')

const ROOM_ID_KEY = 'roomId'

const server = app.listen(3000, () => {
  console.log('Server started and listening port 3000')
})

const wsServer = getWebSocketServer(server, '/room')

const handleOnReceiveMessage = (ws, message) => {
  const anotherPlayerInSameRoomPredicate = (client) => client !== ws && client.readyState == WebSocket.OPEN && client[ROOM_ID_KEY] == ws[ROOM_ID_KEY]
  const anotherPlayer = [...wsServer.clients].find(anotherPlayerInSameRoomPredicate)
  anotherPlayer && anotherPlayer.send(message)
}

const handleOnConnection = (ws, req) => {
  ws[ROOM_ID_KEY] = req.url.substring(req.url.indexOf('=') + 1, req.url.lenght)
  ws.on('message', (message) => handleOnReceiveMessage(ws, message.toString()))
  ws.on('error', (error) => console.error(error))
  ws.on('close', () => console.log('conexão fechou'))
}

wsServer.on('connection', handleOnConnection)
